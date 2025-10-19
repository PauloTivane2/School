import { pool } from '@config/database';

export interface Payment {
  id: number;
  aluno_id: number;
  aluno_nome: string;
  valor: number;
  metodo: string;
  referencia: string;
  data_pagamento: Date;
  estado: string;
}

export class PaymentsRepository {
  async findAll(): Promise<Payment[]> {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.aluno_id,
        a.nome as aluno_nome,
        p.valor,
        p.metodo,
        p.referencia,
        p.data_pagamento,
        p.estado
      FROM pagamentos p
      JOIN alunos a ON p.aluno_id = a.id
      ORDER BY p.data_pagamento DESC
    `);
    return result.rows;
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.aluno_id,
        a.nome as aluno_nome,
        p.valor,
        p.metodo,
        p.referencia,
        p.data_pagamento,
        p.estado
      FROM pagamentos p
      JOIN alunos a ON p.aluno_id = a.id
      WHERE p.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  async create(data: any): Promise<Payment> {
    const result = await pool.query(`
      INSERT INTO pagamentos (aluno_id, valor, metodo, referencia, estado, data_pagamento)
      VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
      RETURNING *
    `, [data.aluno_id, data.valor, data.metodo, data.referencia, data.estado]);
    return result.rows[0];
  }

  async update(id: string, data: any): Promise<Payment> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.aluno_id !== undefined) {
      fields.push(`aluno_id = $${paramIndex++}`);
      values.push(data.aluno_id);
    }
    if (data.valor !== undefined) {
      fields.push(`valor = $${paramIndex++}`);
      values.push(data.valor);
    }
    if (data.metodo !== undefined) {
      fields.push(`metodo = $${paramIndex++}`);
      values.push(data.metodo);
    }
    if (data.estado !== undefined) {
      fields.push(`estado = $${paramIndex++}`);
      values.push(data.estado);
    }

    values.push(id);

    const result = await pool.query(`
      UPDATE pagamentos 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `, values);
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM pagamentos WHERE id = $1', [id]);
  }

  async findRecent(limit: number = 10): Promise<Payment[]> {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.aluno_id,
        a.nome as aluno_nome,
        p.valor,
        p.metodo,
        p.data_pagamento,
        p.estado
      FROM pagamentos p
      JOIN alunos a ON p.aluno_id = a.id
      ORDER BY p.data_pagamento DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }

  async getMonthlyRevenue(): Promise<number> {
    const result = await pool.query(`
      SELECT COALESCE(SUM(valor), 0) as total
      FROM pagamentos
      WHERE estado = 'pago'
        AND EXTRACT(MONTH FROM data_pagamento) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM data_pagamento) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);
    return parseFloat(result.rows[0].total);
  }
}