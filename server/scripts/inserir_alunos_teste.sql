-- Script para inserir alunos de teste se não existirem

-- Verificar e inserir encarregados
INSERT INTO encarregados (nome, email, morada)
VALUES 
    ('João Pedro Silva', 'joao.silva@email.com', 'Maputo, Av. Julius Nyerere'),
    ('Maria Santos Costa', 'maria.costa@email.com', 'Matola, Bairro Machava'),
    ('Carlos Alberto Moiane', 'carlos.moiane@email.com', 'Maputo, Bairro Central')
ON CONFLICT (email) DO NOTHING;

-- Verificar e inserir classes
INSERT INTO classes (nome_classe)
VALUES 
    ('8ª Classe'),
    ('9ª Classe'),
    ('10ª Classe'),
    ('11ª Classe'),
    ('12ª Classe')
ON CONFLICT DO NOTHING;

-- Verificar e inserir turmas
INSERT INTO turmas (turma, id_classe, ano)
SELECT 'Turma A', id_classes, 2024
FROM classes WHERE nome_classe = '8ª Classe'
ON CONFLICT DO NOTHING;

INSERT INTO turmas (turma, id_classe, ano)
SELECT 'Turma B', id_classes, 2024
FROM classes WHERE nome_classe = '9ª Classe'
ON CONFLICT DO NOTHING;

-- Inserir alunos de teste
INSERT INTO alunos (nome_aluno, data_nascimento, genero, bi, nuit, id_classe, id_turma, id_encarregados, estado)
SELECT 
    'Miguel Silva Santos',
    '2010-03-15'::DATE,
    'M',
    'AL001MZ2010',
    '100000001',
    c.id_classes,
    t.id_turma,
    e.id_encarregados,
    'ativo'
FROM classes c
CROSS JOIN turmas t
CROSS JOIN encarregados e
WHERE c.nome_classe = '8ª Classe'
  AND t.turma = 'Turma A'
  AND e.email = 'joao.silva@email.com'
  AND NOT EXISTS (SELECT 1 FROM alunos WHERE bi = 'AL001MZ2010');

INSERT INTO alunos (nome_aluno, data_nascimento, genero, bi, nuit, id_classe, id_turma, id_encarregados, estado)
SELECT 
    'Ana Paula Moiane',
    '2009-07-22'::DATE,
    'F',
    'AL002MZ2009',
    '100000002',
    c.id_classes,
    t.id_turma,
    e.id_encarregados,
    'ativo'
FROM classes c
CROSS JOIN turmas t
CROSS JOIN encarregados e
WHERE c.nome_classe = '9ª Classe'
  AND t.turma = 'Turma B'
  AND e.email = 'maria.costa@email.com'
  AND NOT EXISTS (SELECT 1 FROM alunos WHERE bi = 'AL002MZ2009');

INSERT INTO alunos (nome_aluno, data_nascimento, genero, bi, nuit, id_classe, id_turma, id_encarregados, estado)
SELECT 
    'Pedro José Costa',
    '2010-11-08'::DATE,
    'M',
    'AL003MZ2010',
    '100000003',
    c.id_classes,
    t.id_turma,
    e.id_encarregados,
    'ativo'
FROM classes c
CROSS JOIN turmas t
CROSS JOIN encarregados e
WHERE c.nome_classe = '8ª Classe'
  AND t.turma = 'Turma A'
  AND e.email = 'carlos.moiane@email.com'
  AND NOT EXISTS (SELECT 1 FROM alunos WHERE bi = 'AL003MZ2010');

INSERT INTO alunos (nome_aluno, data_nascimento, genero, bi, nuit, id_classe, id_turma, id_encarregados, estado)
SELECT 
    'Sofia Maria Nhantumbo',
    '2009-05-14'::DATE,
    'F',
    'AL004MZ2009',
    '100000004',
    c.id_classes,
    t.id_turma,
    e.id_encarregados,
    'ativo'
FROM classes c
CROSS JOIN turmas t
CROSS JOIN encarregados e
WHERE c.nome_classe = '9ª Classe'
  AND t.turma = 'Turma B'
  AND e.email = 'joao.silva@email.com'
  AND NOT EXISTS (SELECT 1 FROM alunos WHERE bi = 'AL004MZ2009');

INSERT INTO alunos (nome_aluno, data_nascimento, genero, bi, nuit, id_classe, id_turma, id_encarregados, estado)
SELECT 
    'Lucas Fernando Macamo',
    '2010-09-30'::DATE,
    'M',
    'AL005MZ2010',
    '100000005',
    c.id_classes,
    t.id_turma,
    e.id_encarregados,
    'ativo'
FROM classes c
CROSS JOIN turmas t
CROSS JOIN encarregados e
WHERE c.nome_classe = '8ª Classe'
  AND t.turma = 'Turma A'
  AND e.email = 'maria.costa@email.com'
  AND NOT EXISTS (SELECT 1 FROM alunos WHERE bi = 'AL005MZ2010');

-- Verificar quantos alunos foram inseridos
SELECT COUNT(*) as total_alunos FROM alunos;
SELECT id_aluno, nome_aluno, estado FROM alunos ORDER BY nome_aluno;
