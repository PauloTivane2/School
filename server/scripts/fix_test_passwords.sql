-- =====================================================
-- FIX: Corrigir senhas dos usuários de teste
-- Hash bcrypt correto para "teste123"
-- =====================================================

UPDATE funcionarios 
SET senha_hash = '$2b$10$HaMwp.5y.XJk9EIPLaE57.0DunfC7mDuT0jyEUeybkOL91ezlP8qe'
WHERE email IN (
    'admin@teste.com',
    'tesoureiro@teste.com', 
    'professor@teste.com',
    'joao.santos@teste.com',
    'maria.costa@teste.com',
    'paulo.machado@teste.com'
);

SELECT '✅ Senhas atualizadas! Use "teste123" para fazer login' as info;
