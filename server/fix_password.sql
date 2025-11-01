-- Corrigir senha da Rosa Mabunda
UPDATE funcionarios 
SET senha_hash = '$2a$10$rT5Z8qY.9K7P3vX6LmZqduO3jGZhVYHhQw5vBfJLkF7hFhKqZJYxW' 
WHERE email = 'rosa.mabunda@escola.com';

-- Verificar se corrigiu
SELECT 
    email, 
    LENGTH(senha_hash) as tamanho_senha, 
    LEFT(senha_hash, 10) as inicio_senha,
    senha_hash
FROM funcionarios 
WHERE email = 'rosa.mabunda@escola.com';
