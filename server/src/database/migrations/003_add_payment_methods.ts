import { pool } from '../../config/database';

/**
 * Migration para adicionar suporte a múltiplos métodos de pagamento
 */
export async function addPaymentMethods() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Adicionar coluna para transaction ID do M-Pesa
    await client.query(`
      ALTER TABLE pagamentos 
      ADD COLUMN IF NOT EXISTS mpesa_transaction_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'Dinheiro',
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pendente';
    `);

    // Criar índice para busca rápida por transaction ID
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pagamentos_mpesa_transaction 
      ON pagamentos(mpesa_transaction_id);
    `);

    // Atualizar valores existentes (se a coluna estado existir)
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'pagamentos' AND column_name = 'estado';
    `);

    if (checkColumn.rows.length > 0) {
      await client.query(`
        UPDATE pagamentos 
        SET payment_status = CASE 
              WHEN estado = 'pago' THEN 'completed'
              WHEN estado = 'pendente' THEN 'pending'
              WHEN estado = 'atrasado' THEN 'overdue'
              ELSE 'pending'
            END
        WHERE payment_status = 'pendente';
      `);
    }

    await client.query('COMMIT');
    console.log('✅ Tabela pagamentos atualizada com métodos de pagamento');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao atualizar tabela pagamentos:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Executar migration se chamado diretamente
if (require.main === module) {
  addPaymentMethods()
    .then(() => {
      console.log('Migration concluída');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erro na migration:', error);
      process.exit(1);
    });
}
