/**
 * Script para gerar hash de senha usando bcrypt
 * 
 * USO:
 * node scripts/generate-password-hash.js senha123
 * 
 * Ou execute sem argumentos para senha padrão "senha123"
 */

const bcrypt = require('bcryptjs');

// Pegar senha do argumento ou usar padrão
const senha = process.argv[2] || 'senha123';

// Gerar hash
bcrypt.hash(senha, 10, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    process.exit(1);
  }

  console.log('\n========================================');
  console.log('Hash de Senha Gerado');
  console.log('========================================');
  console.log('Senha original:', senha);
  console.log('Hash gerado:', hash);
  console.log('========================================');
  console.log('\nUse este hash no campo senha_hash da tabela funcionarios:');
  console.log(`\nINSERT INTO funcionarios (nome_funcionario, email, senha_hash, funcao, estado)`);
  console.log(`VALUES ('Nome', 'email@example.com', '${hash}', 'Admin', 'ativo');`);
  console.log('\n');
});

/**
 * EXEMPLOS DE USO:
 * 
 * # Gerar hash para senha padrão (senha123)
 * node scripts/generate-password-hash.js
 * 
 * # Gerar hash para senha customizada
 * node scripts/generate-password-hash.js minhaSenhaSegura
 * 
 * # Gerar hash para múltiplas senhas (bash)
 * for senha in senha1 senha2 senha3; do
 *   node scripts/generate-password-hash.js $senha
 * done
 */
