import { initDatabase, testConnection, getClient } from './config/database';
import { runMigration } from './database/migrations/001_create_tables';

async function testDatabase() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...');
    
    await initDatabase();
    
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Conexão bem-sucedida!');
      
      console.log('\n🔧 Executando migrações...');
      const client = await getClient();
      try {
        await runMigration(client);
        console.log('✅ Migrações executadas com sucesso!');
      } finally {
        client.release();
      }
    } else {
      console.log('❌ Falha na conexão');
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

testDatabase();
