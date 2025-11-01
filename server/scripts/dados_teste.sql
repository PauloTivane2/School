-- ===========================================================
-- SISTEMA DE GESTÃO ESCOLAR - BANCO DE DADOS AJUSTADO
-- Usando schema padrão 'public'
-- ===========================================================

-- Habilitar extensão de criptografia
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===========================================================
-- 1. Encarregados
-- ===========================================================
CREATE TABLE IF NOT EXISTS encarregados (
    id_encarregados SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    morada TEXT
);

-- Reiniciar sequência para começar em 3025
ALTER SEQUENCE IF EXISTS encarregados_id_encarregados_seq RESTART WITH 3025;

-- ===========================================================
-- 2. Funcionários
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

-- Reiniciar sequência para começar em 1025
ALTER SEQUENCE IF EXISTS funcionarios_id_funcionarios_seq RESTART WITH 1025;

-- ===========================================================
-- 3. Disciplinas
-- ===========================================================
CREATE TABLE IF NOT EXISTS disciplinas (
    id_disciplinas SERIAL PRIMARY KEY,
    nome_disciplina VARCHAR(100) NOT NULL,
    carga_horaria INT NOT NULL CHECK (carga_horaria > 0)
);

-- ===========================================================
-- 4. Classes
-- ===========================================================
-- Mantida a tabela original, mas sem restrição de professor/disciplina única
CREATE TABLE IF NOT EXISTS classes (
    id_classes SERIAL PRIMARY KEY,
    nome_classe VARCHAR(100) NOT NULL
);

-- ===========================================================
-- 4.1 Relações Classes x Professores x Disciplinas
-- ===========================================================
-- Nova tabela para suportar múltiplos professores e disciplinas por classe
CREATE TABLE IF NOT EXISTS classes_relacoes (
    id SERIAL PRIMARY KEY,
    id_classe INT NOT NULL REFERENCES classes(id_classes) ON DELETE CASCADE,
    id_professor INT NOT NULL REFERENCES funcionarios(id_funcionarios) ON DELETE SET NULL,
    id_disciplina INT NOT NULL REFERENCES disciplinas(id_disciplinas) ON DELETE CASCADE,
    UNIQUE(id_classe, id_professor, id_disciplina) -- evita duplicidade da mesma combinação
);

-- ===========================================================
-- 5. Turmas
-- ===========================================================
CREATE TABLE IF NOT EXISTS turmas (
    id_turma SERIAL PRIMARY KEY,
    turma VARCHAR(50) NOT NULL,
    id_classe INT REFERENCES classes(id_classes) ON DELETE SET NULL,
    ano INT NOT NULL,
    id_diretor_turma INT REFERENCES funcionarios(id_funcionarios) ON DELETE SET NULL
);

-- ===========================================================
-- 6. Alunos
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


-- Reiniciar sequência para começar em 2025
ALTER SEQUENCE IF EXISTS aluno_id_aluno_seq RESTART WITH 2025;


-- ===========================================================
-- 7. Contactos
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
-- 8. Avaliações
-- ===========================================================
CREATE TABLE IF NOT EXISTS avaliacoes (
    id SERIAL PRIMARY KEY,
    classe_id INT REFERENCES classes(id_classes) ON DELETE CASCADE,
    tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('Prova', 'TPC', 'Exame', 'Outro')),
    data DATE DEFAULT CURRENT_DATE,
    peso NUMERIC(3,1) DEFAULT 1.0
);

-- ===========================================================
-- 9. Notas
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
-- 10. Presenças
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
-- 11. Matrículas
-- ===========================================================
CREATE TABLE IF NOT EXISTS matriculas (
    id SERIAL PRIMARY KEY,
    aluno_id INT NOT NULL REFERENCES alunos(id_aluno) ON DELETE CASCADE,
    turma_id INT NOT NULL REFERENCES turmas(id_turma) ON DELETE CASCADE,
    data_matricula DATE DEFAULT CURRENT_DATE
);

-- ===========================================================
-- 12. Mensalidades
-- ===========================================================
CREATE TABLE IF NOT EXISTS mensalidades (
    id SERIAL PRIMARY KEY,
    turma_id INT REFERENCES turmas(id_turma) ON DELETE CASCADE,
    valor NUMERIC(10,2) NOT NULL CHECK (valor > 0),
    periodo VARCHAR(20),
    tipo VARCHAR(20)
);

-- ===========================================================
-- 13. Pagamentos
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
-- 14. Pacotes de Exame
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
-- ÍNDICES
-- ===========================================================
CREATE INDEX IF NOT EXISTS idx_aluno_bi ON alunos (bi);
CREATE INDEX IF NOT EXISTS idx_funcionario_email ON funcionarios (email);
CREATE INDEX IF NOT EXISTS idx_pagamento_referencia ON pagamentos (referencia);
CREATE INDEX IF NOT EXISTS idx_turma_ano ON turmas (ano);

-- ===========================================================
-- DADOS DE TESTE
-- ===========================================================

-- Verificar se já existem dados
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM alunos LIMIT 1) THEN
    -- Inserir Encarregados
    INSERT INTO encarregados (nome, email, morada) VALUES
    ('João Silva', 'joao.silva@email.com', 'Maputo, Av. Julius Nyerere'),
    ('Maria Santos', 'maria.santos@email.com', 'Matola, Bairro Machava'),
    ('Pedro Costa', 'pedro.costa@email.com', 'Maputo, Av. Eduardo Mondlane'),
    ('Ana Oliveira', 'ana.oliveira@email.com', 'Boane, Vila'),
    ('Carlos Fernandes', 'carlos.fernandes@email.com', 'Maputo, Costa do Sol');

    -- Inserir Funcionários (Admin e Professores)
    -- Hash bcrypt de '123456': $2a$10$rT5Z8qY.9K7P3vX6LmZqduO3jGZhVYHhQw5vBfJLkF7hFhKqZJYxW
    INSERT INTO funcionarios (nome_funcionario, bi, email, funcao, estado, nivel_academico, senha_hash) VALUES
    ('Admin Sistema', '123456789A', 'admin@escola.com', 'Admin', 'ativo', 'Licenciatura', '$2a$10$rT5Z8qY.9K7P3vX6LmZqduO3jGZhVYHhQw5vBfJLkF7hFhKqZJYxW'),
    ('Prof. António Manuel', '987654321B', 'antonio.manuel@escola.com', 'Professor', 'ativo', 'Licenciatura em Matemática', '$2a$10$rT5Z8qY.9K7P3vX6LmZqduO3jGZhVYHhQw5vBfJLkF7hFhKqZJYxW'),
    ('Prof. Beatriz Sousa', '456789123C', 'beatriz.sousa@escola.com', 'Professor', 'ativo', 'Licenciatura em Português', '$2a$10$rT5Z8qY.9K7P3vX6LmZqduO3jGZhVYHhQw5vBfJLkF7hFhKqZJYxW'),
    ('Prof. Carlos Dias', '321654987D', 'carlos.dias@escola.com', 'Professor', 'ativo', 'Licenciatura em História', '$2a$10$rT5Z8qY.9K7P3vX6LmZqduO3jGZhVYHhQw5vBfJLkF7hFhKqZJYxW'),
    ('Diretora Rosa Mabunda', '789123456E', 'rosa.mabunda@escola.com', 'Diretor', 'ativo', 'Mestrado em Educação', '$2a$10$rT5Z8qY.9K7P3vX6LmZqduO3jGZhVYHhQw5vBfJLkF7hFhKqZJYxW');

    -- Inserir Disciplinas
    INSERT INTO disciplinas (nome_disciplina, carga_horaria) VALUES
    ('Matemática', 5),
    ('Português', 5),
    ('História', 3),
    ('Geografia', 3),
    ('Ciências Naturais', 4),
    ('Inglês', 4),
    ('Física', 4),
    ('Química', 4);

    -- Inserir Classes
    INSERT INTO classes (nome_classe) VALUES
    ('8ª Classe'),
    ('9ª Classe'),
    ('10ª Classe'),
    ('11ª Classe'),
    ('12ª Classe');

    -- Inserir Turmas (usando IDs dinâmicos)
    INSERT INTO turmas (turma, id_classe, ano, id_diretor_turma)
    SELECT t.turma, c.id_classes, t.ano, t.id_diretor
    FROM (VALUES
      ('Turma A', '8ª Classe', 2025, 1025),
      ('Turma B', '8ª Classe', 2025, 1025),
      ('Turma A', '9ª Classe', 2025, 1025),
      ('Turma A', '10ª Classe', 2025, 1025),
      ('Turma A', '12ª Classe', 2025, 1028)
    ) AS t(turma, nome_classe, ano, id_diretor)
    JOIN classes c ON c.nome_classe = t.nome_classe;

    -- Inserir Relações Classes x Professores x Disciplinas (usando IDs dinâmicos)
    INSERT INTO classes_relacoes (id_classe, id_professor, id_disciplina)
    SELECT c.id_classes, cr.id_professor, d.id_disciplinas
    FROM (VALUES
      ('8ª Classe', 1026, 'Matemática'),
      ('8ª Classe', 1027, 'Português'),
      ('8ª Classe', 1028, 'História'),
      ('9ª Classe', 1026, 'Matemática'),
      ('9ª Classe', 1027, 'Português'),
      ('10ª Classe', 1026, 'Física'),
      ('12ª Classe', 1026, 'Matemática')
    ) AS cr(nome_classe, id_professor, nome_disciplina)
    JOIN classes c ON c.nome_classe = cr.nome_classe
    JOIN disciplinas d ON d.nome_disciplina = cr.nome_disciplina;

    -- Inserir Alunos (usando IDs dinâmicos para classe e turma)
    INSERT INTO alunos (nome_aluno, data_nascimento, genero, bi, id_classe, id_turma, id_encarregados, estado)
    SELECT a.nome, a.data_nasc::DATE, a.genero, a.bi, c.id_classes, t.id_turma, a.id_enc, a.estado
    FROM (VALUES
      ('Miguel Silva', '2010-03-15', 'M', 'AL001', '8ª Classe', 'Turma A', 3025, 'ativo'),
      ('Sofia Santos', '2010-05-22', 'F', 'AL002', '8ª Classe', 'Turma A', 3026, 'ativo'),
      ('João Costa', '2009-08-10', 'M', 'AL003', '9ª Classe', 'Turma A', 3027, 'ativo'),
      ('Ana Oliveira', '2009-11-05', 'F', 'AL004', '9ª Classe', 'Turma A', 3028, 'ativo'),
      ('Pedro Fernandes', '2008-01-20', 'M', 'AL005', '10ª Classe', 'Turma A', 3029, 'ativo'),
      ('Mariana Alves', '2010-07-18', 'F', 'AL006', '8ª Classe', 'Turma B', 3025, 'ativo'),
      ('Ricardo Pereira', '2009-09-12', 'M', 'AL007', '9ª Classe', 'Turma A', 3026, 'ativo'),
      ('Beatriz Gomes', '2008-12-03', 'F', 'AL008', '10ª Classe', 'Turma A', 3027, 'ativo'),
      ('Francisco Martins', '2010-04-25', 'M', 'AL009', '8ª Classe', 'Turma A', 3028, 'ativo'),
      ('Carolina Rodrigues', '2009-06-30', 'F', 'AL010', '9ª Classe', 'Turma A', 3029, 'ativo')
    ) AS a(nome, data_nasc, genero, bi, nome_classe, nome_turma, id_enc, estado)
    JOIN classes c ON c.nome_classe = a.nome_classe
    JOIN turmas t ON t.turma = a.nome_turma AND t.id_classe = c.id_classes;

    -- Inserir Contactos
    INSERT INTO contactos (contacto1, contacto2, id_encarregados) VALUES
    ('+258 84 123 4567', '+258 87 234 5678', 3025),
    ('+258 84 234 5678', NULL, 3026),
    ('+258 84 345 6789', '+258 87 456 7890', 3027),
    ('+258 84 456 7890', NULL, 3028),
    ('+258 84 567 8901', '+258 87 678 9012', 3029);

    INSERT INTO contactos (contacto1, contacto2, id_funcionarios) VALUES
    ('+258 84 111 2222', NULL, 1025),
    ('+258 84 222 3333', '+258 87 333 4444', 1026),
    ('+258 84 333 4444', NULL, 1027),
    ('+258 84 444 5555', NULL, 1028);

    -- Inserir Avaliações (usando IDs dinâmicos)
    INSERT INTO avaliacoes (classe_id, tipo, data, peso)
    SELECT c.id_classes, av.tipo, av.data::DATE, av.peso
    FROM (VALUES
      ('8ª Classe', 'Prova', '2025-09-15', 2.0),
      ('8ª Classe', 'TPC', '2025-09-20', 1.0),
      ('9ª Classe', 'Prova', '2025-09-16', 2.0),
      ('10ª Classe', 'Exame', '2025-10-10', 3.0)
    ) AS av(nome_classe, tipo, data, peso)
    JOIN classes c ON c.nome_classe = av.nome_classe;

    -- Inserir Notas (usando SELECT para pegar IDs dinâmicos)
    INSERT INTO notas (aluno_id, avaliacao_id, valor, avaliador_id, trimestre)
    SELECT a.id_aluno, av.id, n.valor, n.avaliador_id, n.trimestre
    FROM (VALUES
      ('AL001', 1, 15.5, 1026, 1),
      ('AL002', 1, 17.0, 1026, 1),
      ('AL003', 3, 14.0, 1026, 1),
      ('AL004', 3, 16.5, 1026, 1),
      ('AL005', 4, 13.0, 1026, 2),
      ('AL001', 2, 18.0, 1027, 1),
      ('AL002', 2, 16.0, 1027, 1)
    ) AS n(bi, avaliacao_id, valor, avaliador_id, trimestre)
    JOIN alunos a ON a.bi = n.bi
    JOIN avaliacoes av ON av.id = n.avaliacao_id;

    -- Inserir Presenças (usando id_classe do aluno)
    INSERT INTO presencas (aluno_id, classe_id, data, presente)
    SELECT a.id_aluno, a.id_classe, p.data::DATE, p.presente
    FROM (VALUES
      ('AL001', '2025-10-28', true),
      ('AL002', '2025-10-28', true),
      ('AL003', '2025-10-28', false),
      ('AL004', '2025-10-28', true),
      ('AL005', '2025-10-28', true),
      ('AL001', '2025-10-29', true),
      ('AL002', '2025-10-29', true),
      ('AL003', '2025-10-29', true)
    ) AS p(bi, data, presente)
    JOIN alunos a ON a.bi = p.bi;

    -- Inserir Matrículas (usando aluno.id_turma já definido)
    INSERT INTO matriculas (aluno_id, turma_id, data_matricula)
    SELECT id_aluno, id_turma, '2025-02-01'
    FROM alunos
    WHERE id_turma IS NOT NULL;

    -- Inserir Mensalidades (usando IDs dinâmicos)
    INSERT INTO mensalidades (turma_id, valor, periodo, tipo)
    SELECT t.id_turma, m.valor, m.periodo, m.tipo
    FROM (VALUES
      ('8ª Classe', 'Turma A', 1500.00, '2025', 'Anual'),
      ('8ª Classe', 'Turma B', 1500.00, '2025', 'Anual'),
      ('9ª Classe', 'Turma A', 2000.00, '2025', 'Anual'),
      ('10ª Classe', 'Turma A', 2500.00, '2025', 'Anual')
    ) AS m(nome_classe, nome_turma, valor, periodo, tipo)
    JOIN classes c ON c.nome_classe = m.nome_classe
    JOIN turmas t ON t.turma = m.nome_turma AND t.id_classe = c.id_classes;

    -- Inserir Pagamentos (usando SELECT para pegar IDs dinâmicos)
    INSERT INTO pagamentos (aluno_id, valor, metodo, estado, data_pagamento)
    SELECT a.id_aluno, p.valor, p.metodo, p.estado, p.data_pagamento::DATE
    FROM (VALUES
      ('AL001', 1500.00, 'Transferência', 'pago', '2025-02-15'),
      ('AL002', 1500.00, 'Dinheiro', 'pago', '2025-02-16'),
      ('AL003', 2000.00, 'M-Pesa', 'pago', '2025-02-17'),
      ('AL004', 2000.00, 'Transferência', 'pendente', '2025-02-18'),
      ('AL005', 2500.00, 'Dinheiro', 'pago', '2025-02-19')
    ) AS p(bi, valor, metodo, estado, data_pagamento)
    JOIN alunos a ON a.bi = p.bi;
  END IF;
END $$;

-- ===========================================================
-- LOG FINAL
-- ===========================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Banco de dados criado e populado com dados de teste!';
  RAISE NOTICE '📊 Total de alunos inseridos: 10';
  RAISE NOTICE '👨‍🏫 Total de professores: 5';
  RAISE NOTICE '📚 Total de classes: 5';
END $$;
