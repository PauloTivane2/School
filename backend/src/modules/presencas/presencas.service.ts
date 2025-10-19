import { pool } from '@config/database';

export interface CreateAttendanceDTO {
  aluno_id: string;
  turma_id: string;
  data: Date;
  presente: boolean;
  observacoes?: string;
}

export interface AttendanceRecord {
  id: string;
  aluno_id: string;
  turma_id: string;
  data: Date;
  presente: boolean;
  observacoes?: string;
  aluno_nome?: string;
  turma_nome?: string;
  created_at: Date;
  updated_at: Date;
}

export class AttendanceService {
  async registerBatch(data: CreateAttendanceDTO[]) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const inserted: AttendanceRecord[] = [];

      for (const record of data) {
        const result = await client.query(
          `INSERT INTO presencas (aluno_id, turma_id, data, presente, observacoes)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [
            record.aluno_id,
            record.turma_id,
            record.data,
            record.presente,
            record.observacoes || null,
          ]
        );
        inserted.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return inserted;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error('Erro ao registrar presenças em lote');
    } finally {
      client.release();
    }
  }

  async findByTurma(turmaId: string, date: Date) {
    const result = await pool.query(
      `SELECT p.*, a.nome AS aluno_nome, t.nome AS turma_nome
       FROM presencas p
       JOIN alunos a ON a.id = p.aluno_id
       JOIN turmas t ON t.id = p.turma_id
       WHERE p.turma_id = $1 AND p.data = $2
       ORDER BY a.nome`,
      [turmaId, date]
    );
    return result.rows;
  }

  async findByStudent(studentId: string, startDate?: Date, endDate?: Date) {
    let query = `SELECT * FROM presencas WHERE aluno_id = $1`;
    const params: any[] = [studentId];

    if (startDate) {
      params.push(startDate);
      query += ` AND data >= $${params.length}`;
    }

    if (endDate) {
      params.push(endDate);
      query += ` AND data <= $${params.length}`;
    }

    query += ' ORDER BY data DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async getAttendanceReport(turmaId: string, startDate: Date, endDate: Date) {
    const result = await pool.query(
      `SELECT 
        t.nome AS turma_nome,
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE presente = true) AS presentes,
        ROUND((COUNT(*) FILTER (WHERE presente = true)::numeric / NULLIF(COUNT(*), 0)) * 100, 1) AS taxa
       FROM presencas p
       JOIN turmas t ON t.id = p.turma_id
       WHERE p.turma_id = $1 AND p.data BETWEEN $2 AND $3
       GROUP BY t.nome`,
      [turmaId, startDate, endDate]
    );
    return result.rows[0];
  }

  async getStudentsByTurma(turmaId: string) {
    const result = await pool.query(
      `SELECT id, nome FROM alunos WHERE turma_id = $1 ORDER BY nome`,
      [turmaId]
    );
    return result.rows;
  }
}
