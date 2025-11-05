// Script para gerar hash bcrypt da senha "teste123"
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'teste123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('\n===========================================');
  console.log('Hash gerado para senha "teste123":');
  console.log('===========================================');
  console.log(hash);
  console.log('\n===========================================');
  console.log('SQL para atualizar:');
  console.log('===========================================');
  console.log(`
UPDATE funcionarios 
SET senha_hash = '${hash}'
WHERE email IN (
    'admin@teste.com',
    'tesoureiro@teste.com', 
    'professor@teste.com',
    'joao.santos@teste.com',
    'maria.costa@teste.com',
    'paulo.machado@teste.com'
);
  `);
  
  // Testar se o hash funciona
  const isValid = await bcrypt.compare('teste123', hash);
  console.log('\n✅ Verificação:', isValid ? 'Hash válido!' : '❌ Erro no hash');
}

generateHash().catch(console.error);
