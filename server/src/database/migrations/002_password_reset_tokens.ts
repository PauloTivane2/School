import { pool } from '../../config/database';

/**
 * Migration para criar tabela de tokens de recuperação de senha
 */
export async function createPasswordResetTokensTable() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Criar tabela de tokens de recuperação
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id_token SERIAL PRIMARY KEY,
        id_funcionario INTEGER NOT NULL REFERENCES funcionarios(id_funcionarios) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        used_at TIMESTAMP
      );
    `);

    // Criar índices para performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token 
      ON password_reset_tokens(token);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_funcionario 
      ON password_reset_tokens(id_funcionario);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires 
      ON password_reset_tokens(expires_at);
    `);

    await client.query('COMMIT');
    console.log('✅ Tabela password_reset_tokens criada com sucesso');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar tabela password_reset_tokens:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Executar migration se chamado diretamente
if (require.main === module) {
  createPasswordResetTokensTable()
    .then(() => {
      console.log('Migration concluída');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erro na migration:', error);
      process.exit(1);
    });
}
