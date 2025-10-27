import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'sge_db',
  password: process.env.DB_PASSWORD || '1234',
  port: Number(process.env.DB_PORT) || 5432,
});

/**
 * Executa o script SQL de dados de teste
 */
export async function runSeed(): Promise<void> {
  const sqlFilePath = path.join(__dirname, '../../scripts/dados_teste.sql');
  
  try {
    console.log('='.repeat(60));
    console.log('🌱 INICIANDO SEED DO BANCO DE DADOS');
    console.log('='.repeat(60));
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`Arquivo SQL não encontrado: ${sqlFilePath}`);
    }

    // Ler o arquivo SQL
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    console.log(`📄 Arquivo carregado: ${path.basename(sqlFilePath)}`);

    // Executar o SQL
    const client = await pool.connect();
    try {
      await client.query(sqlContent);
      console.log('✅ Script SQL executado com sucesso');
    } finally {
      client.release();
    }

    console.log('='.repeat(60));
    console.log('🎉 SEED CONCLUÍDO COM SUCESSO');
    console.log('='.repeat(60));
  } catch (error: any) {
    console.error('='.repeat(60));
    console.error('❌ ERRO AO EXECUTAR SEED');
    console.error('='.repeat(60));
    console.error('Mensagem:', error.message);
    console.error('Arquivo:', sqlFilePath);
    console.error('='.repeat(60));
    throw error;
  }
}

/**
 * Verifica se as tabelas já existem
 */
export async function checkTablesExist(): Promise<boolean> {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'alunos'
      ) as table_exists;
    `);
    return result.rows[0].table_exists;
  } catch {
    return false;
  }
}

/**
 * Executa seed apenas se as tabelas não existirem
 */
export async function runSeedIfNeeded(): Promise<void> {
  const tablesExist = await checkTablesExist();
  
  if (!tablesExist) {
    console.log('📋 Tabelas não encontradas. Executando seed...');
    await runSeed();
  } else {
    console.log('✅ Tabelas já existem. Seed ignorado.');
  }
}

// Se executado diretamente
if (require.main === module) {
  runSeed()
    .then(() => {
      console.log('✅ Processo de seed concluído');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro no processo de seed:', error);
      process.exit(1);
    });
}
