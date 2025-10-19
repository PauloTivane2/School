import { pool } from '@config/database';
import { CreateAttendanceDTO, AttendanceRecord } from './dto/presencas.dto';

export class AttendanceRepository {
  async createBatch(data: CreateAttendanceDTO[]): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const item of data) {
        await client.query(
          `INSERT INTO presencas (aluno_id, data, presente, observacao, classe_id)
           VALUES ($1, $2, $3, $4, NULL)
           ON CONFLICT (aluno_id, data) DO UPDATE 
           SET presente = EXCLUDED.presente, observacao = EXCLUDED.observacao`,
          [item.aluno_id, item.data, item.presente, item.observacoes]
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findByTurmaAndDate(turmaId: string, date: Date): Promise<AttendanceRecord[]> {
    const result = await pool.query(
      `SELECT p.*, a.nome as aluno_nome 
       FROM presencas p
       JOIN alunos a ON p.aluno_id = a.id
       WHERE a.turma_id = $1 AND p.data = $2
       ORDER BY a.nome`,
      [turmaId, date]
    );
    return result.rows;
  }

  async findByStudent(studentId: string, startDate?: Date, endDate?: Date): Promise<AttendanceRecord[]> {
    let query = `
      SELECT p.*, t.nome as turma_nome 
      FROM presencas p
      JOIN alunos a ON p.aluno_id = a.id
      LEFT JOIN turmas t ON a.turma_id = t.id
      WHERE p.aluno_id = $1
    `;
    const params: any[] = [studentId];

    if (startDate && endDate) {
      query += ` AND p.data BETWEEN $2 AND $3`;
      params.push(startDate, endDate);
    }

    query += ` ORDER BY p.data DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findByTurmaAndPeriod(turmaId: string, startDate: Date, endDate: Date): Promise<AttendanceRecord[]> {
    const result = await pool.query(
      `SELECT p.*, a.nome as aluno_nome 
       FROM presencas p
       JOIN alunos a ON p.aluno_id = a.id
       WHERE a.turma_id = $1 AND p.data BETWEEN $2 AND $3
       ORDER BY p.data DESC, a.nome`,
      [turmaId, startDate, endDate]
    );
    return result.rows;
  }
}