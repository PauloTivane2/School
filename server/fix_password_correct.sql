-- Atualizar senha de TODOS os funcionários para 123456
-- Hash gerado com bcrypt para senha "123456"
UPDATE funcionarios 
SET senha_hash = '$2b$10$26oCJ/DJSWlkepY9ZJw6leGt2QLvc.L532d35x41Sk/932ibOOymK'
WHERE email IN ('rosa.mabunda@escola.com', 'admin@escola.com', 'antonio.manuel@escola.com', 'beatriz.sousa@escola.com', 'carlos.dias@escola.com');

-- Verificar
SELECT 
    email, 
    funcao,
    LENGTH(senha_hash) as tamanho_senha, 
    LEFT(senha_hash, 10) as inicio_senha
FROM funcionarios 
WHERE email IN ('rosa.mabunda@escola.com', 'admin@escola.com')
ORDER BY funcao;
