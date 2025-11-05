-- Script para criar tabela de logs de autenticação (RN05)
-- Armazena tentativas de login, sucessos e falhas

CREATE TABLE IF NOT EXISTS auth_logs (
  id_log SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('sucesso', 'falha', 'bloqueado')),
  motivo VARCHAR(255),
  user_id INTEGER,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Índices para performance
  INDEX idx_auth_logs_email (email),
  INDEX idx_auth_logs_status (status),
  INDEX idx_auth_logs_user_id (user_id),
  INDEX idx_auth_logs_created_at (created_at)
);

-- Comentários para documentação
COMMENT ON TABLE auth_logs IS 'Logs de autenticação para auditoria (RN05)';
COMMENT ON COLUMN auth_logs.status IS 'Status da tentativa: sucesso, falha, bloqueado';
COMMENT ON COLUMN auth_logs.motivo IS 'Motivo da falha: email_nao_encontrado, senha_incorreta, aluno_sem_acesso, etc';
COMMENT ON COLUMN auth_logs.user_id IS 'ID do funcionário (quando disponível)';

-- View para análise de logs
CREATE OR REPLACE VIEW v_auth_logs_summary AS
SELECT 
  DATE(created_at) AS data,
  status,
  COUNT(*) AS total,
  COUNT(DISTINCT email) AS emails_unicos
FROM auth_logs
GROUP BY DATE(created_at), status
ORDER BY data DESC, status;

-- Função para limpar logs antigos (manter últimos 90 dias)
CREATE OR REPLACE FUNCTION limpar_auth_logs_antigos()
RETURNS void AS $$
BEGIN
  DELETE FROM auth_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Comentário sobre uso
COMMENT ON FUNCTION limpar_auth_logs_antigos IS 'Remove logs de autenticação com mais de 90 dias';
