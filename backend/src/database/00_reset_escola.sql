-- ===========================================================
-- RESET COMPLETO DO BANCO DE DADOS escola_db + CRIAÇÃO DE TABELAS
-- ===========================================================

-- Encerrar conexões ativas
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'escola_db';

-- Remover banco antigo
DROP DATABASE IF EXISTS escola_db;

-- Criar banco novo
CREATE DATABASE escola_db
    WITH OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'pt_PT.UTF-8'
    LC_CTYPE = 'pt_PT.UTF-8'
    TEMPLATE = template0;

-- Conectar ao banco recém-criado
\c escola_db

-- ===========================================================
-- SISTEMA DE GESTÃO ESCOLAR - BANCO DE DADOS AJUSTADO
-- Usando schema padrão 'public'
-- ===========================================================

-- ===========================================================
-- SISTEMA DE GESTAO ESCOLAR - BANCO DE DADOS AJUSTADO
-- ===========================================================

-- Habilitar extensao de criptografia
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===========================================================
-- 1. ENCARREGADOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS encarregados (
    id_encarregados SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    morada TEXT
);

-- Reiniciar sequencia para começar em 3025
ALTER SEQUENCE IF EXISTS encarregados_id_encarregados_seq RESTART WITH 3025;

-- ===========================================================
-- 2. FUNCIONARIOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS funcionarios (
    id_funcionarios SERIAL PRIMARY KEY,
    nome_funcionario VARCHAR(100) NOT NULL,
    bi VARCHAR(50) UNIQUE,
    nuit VARCHAR(50) UNIQUE,
    nivel_academico VARCHAR(100),
    funcao VARCHAR(50) NOT NULL CHECK (funcao IN ('Professor', 'Diretor', 'Secretaria', 'Admin')),
    email VARCHAR(100) UNIQUE,
    estado VARCHAR(20) DEFAULT 'inativo' CHECK (estado IN ('ativo', 'inativo')),
    senha_hash TEXT DEFAULT crypt('123456', gen_salt('bf'))
);

-- Reiniciar sequencia para começar em 1025
ALTER SEQUENCE IF EXISTS funcionarios_id_funcionarios_seq RESTART WITH 1025;

-- ===========================================================
-- 3. DISCIPLINAS
-- ===========================================================
CREATE TABLE IF NOT EXISTS disciplinas (
    id_disciplinas SERIAL PRIMARY KEY,
    nome_disciplina VARCHAR(100) NOT NULL,
    carga_horaria INT NOT NULL CHECK (carga_horaria > 0)
);

-- ===========================================================
-- 4. CLASSES
-- ===========================================================
CREATE TABLE IF NOT EXISTS classes (
    id_classes SERIAL PRIMARY KEY,
    nome_classe VARCHAR(100) NOT NULL
);

-- ===========================================================
-- 4.1 RELACOES CLASSES x PROFESSORES x DISCIPLINAS
-- ===========================================================
CREATE TABLE IF NOT EXISTS classes_relacoes (
    id SERIAL PRIMARY KEY,
    id_classe INT NOT NULL REFERENCES classes(id_classes) ON DELETE CASCADE,
    id_professor INT NOT NULL REFERENCES funcionarios(id_funcionarios) ON DELETE SET NULL,
    id_disciplina INT NOT NULL REFERENCES disciplinas(id_disciplinas) ON DELETE CASCADE,
    UNIQUE(id_classe, id_professor, id_disciplina)
);

-- ===========================================================
-- 5. TURMAS
-- ===========================================================
CREATE TABLE IF NOT EXISTS turmas (
    id_turma SERIAL PRIMARY KEY,
    turma VARCHAR(50) NOT NULL,
    id_classe INT REFERENCES classes(id_classes) ON DELETE SET NULL,
    ano INT NOT NULL,
    id_diretor_turma INT REFERENCES funcionarios(id_funcionarios) ON DELETE SET NULL
);

-- ===========================================================
-- 6. ALUNOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS alunos (
    id_aluno SERIAL PRIMARY KEY,
    nome_aluno VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    genero CHAR(1) CHECK (genero IN ('M','F')),
    bi VARCHAR(50) UNIQUE,
    nuit VARCHAR(50) UNIQUE,
    id_classe INT REFERENCES classes(id_classes) ON DELETE SET NULL,
    id_turma INT REFERENCES turmas(id_turma) ON DELETE SET NULL,
    id_encarregados INT REFERENCES encarregados(id_encarregados) ON DELETE SET NULL,
    estado VARCHAR(20) DEFAULT 'inativo' CHECK (estado IN ('ativo','inativo'))
);

-- Reiniciar sequencia para alunos a partir de 2025
ALTER SEQUENCE IF EXISTS alunos_id_aluno_seq RESTART WITH 2025;

-- ===========================================================
-- 7. CONTACTOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS contactos (
    id_contacto SERIAL PRIMARY KEY,
    contacto1 VARCHAR(20) NOT NULL,
    contacto2 VARCHAR(20),
    contacto3 VARCHAR(20),
    id_encarregados INT REFERENCES encarregados(id_encarregados) ON DELETE CASCADE,
    id_funcionarios INT REFERENCES funcionarios(id_funcionarios) ON DELETE CASCADE,
    CHECK (
        (id_encarregados IS NOT NULL AND id_funcionarios IS NULL)
        OR
        (id_encarregados IS NULL AND id_funcionarios IS NOT NULL)
    )
);

-- ===========================================================
-- 8. AVALIACOES
-- ===========================================================
CREATE TABLE IF NOT EXISTS avaliacoes (
    id SERIAL PRIMARY KEY,
    classe_id INT REFERENCES classes(id_classes) ON DELETE CASCADE,
    tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('Prova', 'TPC', 'Exame', 'Outro')),
    data DATE DEFAULT CURRENT_DATE,
    peso NUMERIC(3,1) DEFAULT 1.0
);

-- ===========================================================
-- 9. NOTAS
-- ===========================================================
CREATE TABLE IF NOT EXISTS notas (
    id SERIAL PRIMARY KEY,
    aluno_id INT REFERENCES alunos(id_aluno) ON DELETE CASCADE,
    avaliacao_id INT REFERENCES avaliacoes(id) ON DELETE CASCADE,
    valor NUMERIC(4,1) CHECK (valor BETWEEN 0 AND 20),
    avaliador_id INT REFERENCES funcionarios(id_funcionarios) ON DELETE SET NULL,
    trimestre INT CHECK (trimestre BETWEEN 1 AND 3)
);

-- ===========================================================
-- 10. PRESENCAS
-- ===========================================================
CREATE TABLE IF NOT EXISTS presencas (
    id SERIAL PRIMARY KEY,
    aluno_id INT REFERENCES alunos(id_aluno) ON DELETE CASCADE,
    classe_id INT REFERENCES classes(id_classes) ON DELETE CASCADE,
    data DATE DEFAULT CURRENT_DATE,
    presente BOOLEAN DEFAULT TRUE,
    observacao TEXT
);

-- ===========================================================
-- 11. MATRICULAS
-- ===========================================================
CREATE TABLE IF NOT EXISTS matriculas (
    id SERIAL PRIMARY KEY,
    aluno_id INT NOT NULL REFERENCES alunos(id_aluno) ON DELETE CASCADE,
    turma_id INT NOT NULL REFERENCES turmas(id_turma) ON DELETE CASCADE,
    data_matricula DATE DEFAULT CURRENT_DATE
);

-- ===========================================================
-- 12. MENSALIDADES
-- ===========================================================
CREATE TABLE IF NOT EXISTS mensalidades (
    id SERIAL PRIMARY KEY,
    turma_id INT REFERENCES turmas(id_turma) ON DELETE CASCADE,
    valor NUMERIC(10,2) NOT NULL CHECK (valor > 0),
    periodo VARCHAR(20),
    tipo VARCHAR(20)
);

-- ===========================================================
-- 13. PAGAMENTOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS pagamentos (
    id SERIAL PRIMARY KEY,
    aluno_id INT REFERENCES alunos(id_aluno) ON DELETE CASCADE,
    valor NUMERIC(10,2) NOT NULL,
    metodo VARCHAR(50),
    referencia VARCHAR(100) UNIQUE,
    estado VARCHAR(20) CHECK (estado IN ('pago','pendente','cancelado')),
    data_pagamento DATE DEFAULT CURRENT_DATE
);

-- ===========================================================
-- 14. PACOTES DE EXAME
-- ===========================================================
CREATE TABLE IF NOT EXISTS exame_pacotes (
    id SERIAL PRIMARY KEY,
    aluno_id INT REFERENCES alunos(id_aluno) ON DELETE CASCADE,
    tipo_exame VARCHAR(50) NOT NULL,
    ano INT NOT NULL,
    taxa NUMERIC(10,2) CHECK (taxa >= 0),
    estado VARCHAR(20) DEFAULT 'pendente'
);

-- ===========================================================
-- INDICES
-- ===========================================================
CREATE INDEX IF NOT EXISTS idx_aluno_bi ON alunos (bi);
CREATE INDEX IF NOT EXISTS idx_funcionario_email ON funcionarios (email);
CREATE INDEX IF NOT EXISTS idx_pagamento_referencia ON pagamentos (referencia);
CREATE INDEX IF NOT EXISTS idx_turma_ano ON turmas (ano);

-- ===========================================================
-- LOG FINAL
-- ===========================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Estrutura do banco de dados criada com sucesso! Sequencia de alunos iniciando em 2025.';
END $$;
