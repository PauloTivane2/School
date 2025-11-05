-- Script para criar usuários de teste
-- NOTA: As senhas estão hasheadas com bcrypt
-- Senha padrão para todos: "senha123"
-- Hash gerado com: bcrypt.hash('senha123', 10)

-- Hash da senha "senha123": $2a$10$vwXgJqb5lXl5M.Xr0y9W5eN0LzLJdNIxIU9rvr5mMSzC8nLkJEW9O

-- 1. ADMIN - Acesso Total
INSERT INTO funcionarios (nome_funcionario, email, senha_hash, funcao, estado, data_contratacao)
VALUES 
  ('Paulo Tivane', 'admin@escola.com', '$2a$10$vwXgJqb5lXl5M.Xr0y9W5eN0LzLJdNIxIU9rvr5mMSzC8nLkJEW9O', 'Admin', 'ativo', CURRENT_DATE),
  ('Director Escola', 'diretor@escola.com', '$2a$10$vwXgJqb5lXl5M.Xr0y9W5eN0LzLJdNIxIU9rvr5mMSzC8nLkJEW9O', 'Diretor', 'ativo', CURRENT_DATE)
ON CONFLICT (email) DO NOTHING;

-- 2. TESOURARIA - Módulo Financeiro
INSERT INTO funcionarios (nome_funcionario, email, senha_hash, funcao, estado, data_contratacao)
VALUES 
  ('Maria Tesoureira', 'tesouraria@escola.com', '$2a$10$vwXgJqb5lXl5M.Xr0y9W5eN0LzLJdNIxIU9rvr5mMSzC8nLkJEW9O', 'Tesouraria', 'ativo', CURRENT_DATE),
  ('João Financeiro', 'financeiro@escola.com', '$2a$10$vwXgJqb5lXl5M.Xr0y9W5eN0LzLJdNIxIU9rvr5mMSzC8nLkJEW9O', 'Tesoureiro', 'ativo', CURRENT_DATE)
ON CONFLICT (email) DO NOTHING;

-- 3. PROFESSOR - Suas Turmas
INSERT INTO funcionarios (nome_funcionario, email, senha_hash, funcao, estado, data_contratacao, especialidade)
VALUES 
  ('Carlos Professor', 'professor@escola.com', '$2a$10$vwXgJqb5lXl5M.Xr0y9W5eN0LzLJdNIxIU9rvr5mMSzC8nLkJEW9O', 'Professor', 'ativo', CURRENT_DATE, 'Matemática'),
  ('Ana Docente', 'docente@escola.com', '$2a$10$vwXgJqb5lXl5M.Xr0y9W5eN0LzLJdNIxIU9rvr5mMSzC8nLkJEW9O', 'Docente', 'ativo', CURRENT_DATE, 'Português')
ON CONFLICT (email) DO NOTHING;

-- 4. ENCARREGADO - Apenas Seus Educandos
INSERT INTO funcionarios (nome_funcionario, email, senha_hash, funcao, estado, data_contratacao)
VALUES 
  ('José Encarregado', 'encarregado@escola.com', '$2a$10$vwXgJqb5lXl5M.Xr0y9W5eN0LzLJdNIxIU9rvr5mMSzC8nLkJEW9O', 'Encarregado', 'ativo', CURRENT_DATE),
  ('Rosa Guardiã', 'guardiao@escola.com', '$2a$10$vwXgJqb5lXl5M.Xr0y9W5eN0LzLJdNIxIU9rvr5mMSzC8nLkJEW9O', 'Guardian', 'ativo', CURRENT_DATE)
ON CONFLICT (email) DO NOTHING;

-- 5. Criar uma turma para vincular ao professor
INSERT INTO turmas (nome_turma, ano_lectivo, nivel_ensino, estado)
VALUES 
  ('10ª Classe A', '2024', 'Secundário', 'ativo')
ON CONFLICT DO NOTHING;

-- 6. Vincular professor à turma (assumindo id_turma = 1 e professor com id = 3)
UPDATE turmas 
SET id_diretor_turma = (SELECT id_funcionarios FROM funcionarios WHERE email = 'professor@escola.com' LIMIT 1)
WHERE nome_turma = '10ª Classe A';

-- 7. Criar alunos de exemplo e vincular ao encarregado
-- (assumindo encarregado com id = 5)
INSERT INTO alunos (nome, data_nascimento, id_encarregado, id_turma, estado)
VALUES 
  ('João Silva', '2008-05-15', 
   (SELECT id_funcionarios FROM funcionarios WHERE email = 'encarregado@escola.com' LIMIT 1),
   (SELECT id_turma FROM turmas WHERE nome_turma = '10ª Classe A' LIMIT 1),
   'ativo'),
  ('Maria Silva', '2010-08-20', 
   (SELECT id_funcionarios FROM funcionarios WHERE email = 'encarregado@escola.com' LIMIT 1),
   (SELECT id_turma FROM turmas WHERE nome_turma = '10ª Classe A' LIMIT 1),
   'ativo')
ON CONFLICT DO NOTHING;

-- Verificar usuários criados
SELECT 
  id_funcionarios,
  nome_funcionario,
  email,
  funcao,
  estado
FROM funcionarios
WHERE email LIKE '%@escola.com'
ORDER BY funcao, nome_funcionario;

-- Informações de login
SELECT 
  '==========================================',
  'USUÁRIOS DE TESTE CRIADOS',
  '==========================================',
  '',
  'ADMIN:',
  '  Email: admin@escola.com',
  '  Senha: senha123',
  '  Acesso: Total',
  '',
  'TESOURARIA:',
  '  Email: tesouraria@escola.com',
  '  Senha: senha123',
  '  Acesso: Módulo Financeiro',
  '',
  'PROFESSOR:',
  '  Email: professor@escola.com',
  '  Senha: senha123',
  '  Acesso: Suas Turmas (10ª Classe A)',
  '',
  'ENCARREGADO:',
  '  Email: encarregado@escola.com',
  '  Senha: senha123',
  '  Acesso: Seus Educandos (João e Maria Silva)',
  '',
  '==========================================';
