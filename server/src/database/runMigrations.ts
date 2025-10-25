import { pool } from '../config/database';
import { runMigration, rollbackMigration } from './migrations/001_create_tables';

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await runMigration(client);
    await client.query('COMMIT');
    console.log('✅ Migrações executadas com sucesso');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao executar migrações:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function rollbackMigrations() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await rollbackMigration(client);
    await client.query('COMMIT');
    console.log('✅ Migrações revertidas com sucesso');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao reverter migrações:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Execução via CLI
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'rollback') {
    rollbackMigrations()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    runMigrations()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

export { runMigrations, rollbackMigrations };