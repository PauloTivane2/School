import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'sge_db',
  password: process.env.DB_PASSWORD || '1234',
  port: Number(process.env.DB_PORT) || 5432,
});

// Eventos do pool
pool.on('connect', () => {
  console.log('🔗 Cliente PostgreSQL conectado');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente PostgreSQL:', err);
  process.exit(-1);
});

// Inicializa e testa conexão
export async function initDatabase(): Promise<void> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW(), current_database() as db');
    console.log('='.repeat(60));
    console.log('✅ BANCO DE DADOS CONECTADO');
    console.log('='.repeat(60));
    console.log(`📊 Database: ${result.rows[0].db}`);
    console.log(`🕐 Hora do servidor: ${result.rows[0].now}`);
    console.log(`🔌 Host: ${process.env.DB_HOST || 'db'}`);
    console.log(`👤 User: ${process.env.DB_USER || 'postgres'}`);
    console.log('='.repeat(60));
    client.release();
  } catch (error: any) {
    console.error('='.repeat(60));
    console.error('❌ ERRO AO CONECTAR AO BANCO DE DADOS');
    console.error('='.repeat(60));
    console.error('Mensagem:', error.message);
    console.error('Host:', process.env.DB_HOST || 'db');
    console.error('Database:', process.env.DB_NAME || 'sge_db');
    console.error('='.repeat(60));
    throw error;
  }
}

// Função de teste de conexão
export async function testConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT NOW()');
    return true;
  } catch {
    return false;
  }
}

// Função para pegar client (transações)
export async function getClient() {
  return await pool.connect();
}
