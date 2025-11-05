-- =====================================================
-- DADOS DE TESTE - ÁREA DE ENCARREGADOS
-- Senha para todos: "teste123"
-- =====================================================

-- 1. ENCARREGADOS
INSERT INTO encarregados (nome, email, morada) VALUES 
('Teste João Santos', 'joao.santos@teste.com', 'Rua das Flores, 123, Maputo'),
('Teste Maria Costa', 'maria.costa@teste.com', 'Av. Julius Nyerere, 456, Maputo'),
('Teste Paulo Machado', 'paulo.machado@teste.com', 'Rua da Paz, 789, Matola')
ON CONFLICT (email) DO NOTHING;

-- 2. FUNCIONÁRIOS (para login) - Senha: teste123
-- Hash bcrypt: $2b$10$HaMwp.5y.XJk9EIPLaE57.0DunfC7mDuT0jyEUeybkOL91ezlP8qe
INSERT INTO funcionarios (nome_funcionario, email, funcao, senha_hash, estado) VALUES 
('Admin Teste', 'admin@teste.com', 'Admin', '$2b$10$HaMwp.5y.XJk9EIPLaE57.0DunfC7mDuT0jyEUeybkOL91ezlP8qe', 'ativo'),
('Tesoureiro Teste', 'tesoureiro@teste.com', 'Tesouraria', '$2b$10$HaMwp.5y.XJk9EIPLaE57.0DunfC7mDuT0jyEUeybkOL91ezlP8qe', 'ativo'),
('Professor Teste', 'professor@teste.com', 'Professor', '$2b$10$HaMwp.5y.XJk9EIPLaE57.0DunfC7mDuT0jyEUeybkOL91ezlP8qe', 'ativo'),
('Teste João Santos', 'joao.santos@teste.com', 'Encarregado', '$2b$10$HaMwp.5y.XJk9EIPLaE57.0DunfC7mDuT0jyEUeybkOL91ezlP8qe', 'ativo'),
('Teste Maria Costa', 'maria.costa@teste.com', 'Encarregado', '$2b$10$HaMwp.5y.XJk9EIPLaE57.0DunfC7mDuT0jyEUeybkOL91ezlP8qe', 'ativo'),
('Teste Paulo Machado', 'paulo.machado@teste.com', 'Encarregado', '$2b$10$HaMwp.5y.XJk9EIPLaE57.0DunfC7mDuT0jyEUeybkOL91ezlP8qe', 'ativo')
ON CONFLICT (email) DO UPDATE SET senha_hash = EXCLUDED.senha_hash, funcao = EXCLUDED.funcao;

-- 3. CLASSES (create classes first)
INSERT INTO classes (nome_classe) VALUES 
('10ª'),
('11ª'),
('12ª')
ON CONFLICT DO NOTHING;

-- 3.1. TURMAS
INSERT INTO turmas (turma, id_classe, ano) VALUES 
('10ª A', (SELECT id_classes FROM classes WHERE nome_classe = '10ª' LIMIT 1), 2024),
('11ª B', (SELECT id_classes FROM classes WHERE nome_classe = '11ª' LIMIT 1), 2024),
('12ª C', (SELECT id_classes FROM classes WHERE nome_classe = '12ª' LIMIT 1), 2024)
ON CONFLICT DO NOTHING;

-- 4. DISCIPLINAS
INSERT INTO disciplinas (nome_disciplina, carga_horaria) VALUES 
('Matemática', 4),
('Português', 4),
('Física', 3),
('Química', 3),
('Inglês', 3)
ON CONFLICT DO NOTHING;

-- 5. CRIAR ALUNOS
DO $$
DECLARE
    enc1 INT; enc2 INT; enc3 INT;
    t1 INT; t2 INT; t3 INT;
    a1 INT; a2 INT; a3 INT; a4 INT; a5 INT; a6 INT;
    d1 INT; d2 INT; d3 INT;
    c1 INT; c2 INT; c3 INT;
    av1 INT; av2 INT; av3 INT; av4 INT;
BEGIN
    SELECT id_encarregados INTO enc1 FROM encarregados WHERE email = 'joao.santos@teste.com';
    SELECT id_encarregados INTO enc2 FROM encarregados WHERE email = 'maria.costa@teste.com';
    SELECT id_encarregados INTO enc3 FROM encarregados WHERE email = 'paulo.machado@teste.com';
    SELECT id_turma INTO t1 FROM turmas WHERE turma = '10ª A';
    SELECT id_turma INTO t2 FROM turmas WHERE turma = '11ª B';
    SELECT id_turma INTO t3 FROM turmas WHERE turma = '12ª C';
    
    -- Alunos
    INSERT INTO alunos (nome_aluno, data_nascimento, genero, id_encarregados, id_turma, estado) VALUES 
    ('Teste Pedro Santos', '2008-03-15', 'M', enc1, t1, 'ativo'),
    ('Teste Ana Santos', '2007-07-22', 'F', enc1, t2, 'ativo'),
    ('Teste Carlos Costa', '2008-11-10', 'M', enc2, t1, 'ativo'),
    ('Teste Lucas Machado', '2008-01-05', 'M', enc3, t1, 'ativo'),
    ('Teste Sofia Machado', '2007-05-18', 'F', enc3, t2, 'ativo'),
    ('Teste Miguel Machado', '2006-09-30', 'M', enc3, t3, 'ativo')
    ON CONFLICT DO NOTHING;
    
    -- Pegar IDs dos alunos e disciplinas
    SELECT id_aluno INTO a1 FROM alunos WHERE nome_aluno = 'Teste Pedro Santos';
    SELECT id_aluno INTO a2 FROM alunos WHERE nome_aluno = 'Teste Ana Santos';
    SELECT id_aluno INTO a3 FROM alunos WHERE nome_aluno = 'Teste Carlos Costa';
    SELECT id_aluno INTO a4 FROM alunos WHERE nome_aluno = 'Teste Lucas Machado';
    SELECT id_aluno INTO a5 FROM alunos WHERE nome_aluno = 'Teste Sofia Machado';
    SELECT id_aluno INTO a6 FROM alunos WHERE nome_aluno = 'Teste Miguel Machado';
    SELECT id_disciplinas INTO d1 FROM disciplinas WHERE nome_disciplina = 'Matemática';
    SELECT id_disciplinas INTO d2 FROM disciplinas WHERE nome_disciplina = 'Português';
    SELECT id_disciplinas INTO d3 FROM disciplinas WHERE nome_disciplina = 'Física';
    
    -- Pegar IDs das classes
    SELECT id_classes INTO c1 FROM classes WHERE nome_classe = '10ª';
    SELECT id_classes INTO c2 FROM classes WHERE nome_classe = '11ª';
    SELECT id_classes INTO c3 FROM classes WHERE nome_classe = '12ª';
    
    -- AVALIACOES (create assessments first)
    INSERT INTO avaliacoes (classe_id, tipo, data, peso) VALUES 
    (c1, 'Prova', CURRENT_DATE - 60, 1.0),
    (c1, 'Prova', CURRENT_DATE - 30, 1.0),
    (c2, 'Prova', CURRENT_DATE - 60, 1.0),
    (c2, 'Prova', CURRENT_DATE - 30, 1.0)
    ON CONFLICT DO NOTHING;
    
    -- NOTAS (using avaliacoes structure)
    SELECT id INTO av1 FROM avaliacoes WHERE classe_id = c1 AND data = CURRENT_DATE - 60 LIMIT 1;
    SELECT id INTO av2 FROM avaliacoes WHERE classe_id = c1 AND data = CURRENT_DATE - 30 LIMIT 1;
    SELECT id INTO av3 FROM avaliacoes WHERE classe_id = c2 AND data = CURRENT_DATE - 60 LIMIT 1;
    SELECT id INTO av4 FROM avaliacoes WHERE classe_id = c2 AND data = CURRENT_DATE - 30 LIMIT 1;
    
    INSERT INTO notas (aluno_id, avaliacao_id, valor, trimestre) VALUES 
    (a1, av1, 15.5, 1),
    (a1, av2, 16.0, 2),
    (a1, av1, 13.0, 1),
    (a1, av2, 14.5, 2),
    (a2, av3, 17.0, 1),
    (a2, av4, 18.0, 2),
    (a3, av1, 9.0, 1),
    (a3, av2, 8.5, 2)
    ON CONFLICT DO NOTHING;
    
    -- PRESENÇAS (20 dias para cada aluno)
    FOR i IN 1..20 LOOP
        INSERT INTO presencas (aluno_id, classe_id, data, presente) VALUES 
        (a1, c1, CURRENT_DATE - i, CASE WHEN i IN (3,7) THEN FALSE ELSE TRUE END),
        (a3, c1, CURRENT_DATE - i, CASE WHEN i IN (2,4,6,8,10,12) THEN FALSE ELSE TRUE END)
        ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- PAGAMENTOS (using simplified structure)
    INSERT INTO pagamentos (aluno_id, valor, data_pagamento, estado, metodo) VALUES 
    (a1, 2500, '2024-01-03', 'pago', 'M-Pesa'),
    (a1, 2500, '2024-02-04', 'pago', 'M-Pesa'),
    (a2, 3000, '2024-01-04', 'pago', 'M-Pesa'),
    (a2, 3000, NULL, 'pendente', NULL),
    (a3, 2500, NULL, 'pendente', NULL),
    (a3, 2500, NULL, 'pendente', NULL)
    ON CONFLICT DO NOTHING;
    
    -- EXAMES (skip if table doesn't exist or has different structure)
    -- Note: exames and exames_inscricoes tables may not exist in current schema
END $$;

-- CREDENCIAIS
SELECT '========== CREDENCIAIS DE TESTE ==========' as info
UNION ALL SELECT 'admin@teste.com / teste123 (Admin)'
UNION ALL SELECT 'tesoureiro@teste.com / teste123 (Tesouraria)'
UNION ALL SELECT 'professor@teste.com / teste123 (Professor)'
UNION ALL SELECT 'joao.santos@teste.com / teste123 (Encarregado - 2 filhos)'
UNION ALL SELECT 'maria.costa@teste.com / teste123 (Encarregado - 1 filho)'
UNION ALL SELECT 'paulo.machado@teste.com / teste123 (Encarregado - 3 filhos)';
