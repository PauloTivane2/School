-- =====================================================
-- FIX: Adicionar Encarregado e Tesouraria como roles válidos
-- =====================================================

-- Remover constraint antiga
ALTER TABLE funcionarios DROP CONSTRAINT IF EXISTS funcionarios_funcao_check;

-- Adicionar constraint com todos os roles válidos
ALTER TABLE funcionarios 
ADD CONSTRAINT funcionarios_funcao_check 
CHECK (funcao IN ('Professor', 'Diretor', 'Secretaria', 'Admin', 'Encarregado', 'Tesouraria'));

-- Log
SELECT '✅ Constraint atualizada com sucesso! Roles válidos: Professor, Diretor, Secretaria, Admin, Encarregado, Tesouraria' as info;
