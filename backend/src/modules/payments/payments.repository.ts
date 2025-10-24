import { pool } from '../../config/database';
import { Payment, PaymentWithStudent } from './payment.entity';
import { CreatePaymentDTO, UpdatePaymentDTO } from './dto';

export class PaymentsRepository {
  async findAll(filters?: {
    aluno_id?: number;
    estado?: string;
    data_inicio?: Date;
    data_fim?: Date;
  }): Promise<PaymentWithStudent[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (filters?.aluno_id) {
      conditions.push(`p.aluno_id = $${idx++}`);
      params.push(filters.aluno_id);
    }

    if (filters?.estado) {
      conditions.push(`p.estado = $${idx++}`);
      params.push(filters.estado);
    }

    if (filters?.data_inicio) {
      conditions.push(`p.data_pagamento >= $${idx++}`);
      params.push(filters.data_inicio);
    }

    if (filters?.data_fim) {
      conditions.push(`p.data_pagamento <= $${idx++}`);
      params.push(filters.data_fim);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        p.*,
        a.nome_aluno,
        t.turma AS turma_nome
      FROM pagamentos p
      LEFT JOIN alunos a ON p.aluno_id = a.id_aluno
      LEFT JOIN turmas t ON a.id_turma = t.id_turma
      ${whereClause}
      ORDER BY p.data_pagamento DESC, p.id DESC
      LIMIT 1000
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id: number): Promise<PaymentWithStudent | null> {
    const query = `
      SELECT 
        p.*,
        a.nome_aluno,
        t.turma AS turma_nome
      FROM pagamentos p
      LEFT JOIN alunos a ON p.aluno_id = a.id_aluno
      LEFT JOIN turmas t ON a.id_turma = t.id_turma
      WHERE p.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByReferencia(referencia: string): Promise<Payment | null> {
    const result = await pool.query('SELECT * FROM pagamentos WHERE referencia = $1', [referencia]);
    return result.rows[0] || null;
  }

  async create(data: CreatePaymentDTO): Promise<Payment> {
    const query = `
      INSERT INTO pagamentos (aluno_id, valor, metodo, referencia, estado, data_pagamento)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      data.aluno_id,
      data.valor,
      data.metodo,
      data.referencia,
      data.estado,
      data.data_pagamento || new Date(),
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(id: number, data: UpdatePaymentDTO): Promise<Payment> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.aluno_id !== undefined) {
      fields.push(`aluno_id = $${idx++}`);
      values.push(data.aluno_id);
    }
    if (data.valor !== undefined) {
      fields.push(`valor = $${idx++}`);
      values.push(data.valor);
    }
    if (data.metodo !== undefined) {
      fields.push(`metodo = $${idx++}`);
      values.push(data.metodo);
    }
    if (data.referencia !== undefined) {
      fields.push(`referencia = $${idx++}`);
      values.push(data.referencia);
    }
    if (data.estado !== undefined) {
      fields.push(`estado = $${idx++}`);
      values.push(data.estado);
    }
    if (data.data_pagamento !== undefined) {
      fields.push(`data_pagamento = $${idx++}`);
      values.push(data.data_pagamento);
    }

    values.push(id);

    const query = `
      UPDATE pagamentos 
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM pagamentos WHERE id = $1', [id]);
  }

  async getTotalByStudent(alunoId: number): Promise<number> {
    const result = await pool.query(
      `SELECT COALESCE(SUM(valor), 0) as total 
       FROM pagamentos 
       WHERE aluno_id = $1 AND estado = 'pago'`,
      [alunoId]
    );
    return parseFloat(result.rows[0].total);
  }

  async getPaymentStats(filters?: { data_inicio?: Date; data_fim?: Date }) {
    const conditions: string[] = ['estado = $1'];
    const params: any[] = ['pago'];
    let idx = 2;

    if (filters?.data_inicio) {
      conditions.push(`data_pagamento >= $${idx++}`);
      params.push(filters.data_inicio);
    }

    if (filters?.data_fim) {
      conditions.push(`data_pagamento <= $${idx++}`);
      params.push(filters.data_fim);
    }

    const whereClause = conditions.join(' AND ');

    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_pagamentos,
        COALESCE(SUM(valor), 0) as total_valor,
        COALESCE(AVG(valor), 0) as valor_medio
       FROM pagamentos
       WHERE ${whereClause}`,
      params
    );

    return result.rows[0];
  }
}
