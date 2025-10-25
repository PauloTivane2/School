import { pool } from '../../config/database';
import { Attendance, AttendanceWithDetails } from './attendance.entity';
import { CreateAttendanceDTO } from './dto';

export class AttendanceRepository {
  async findAll(filters?: {
    aluno_id?: number;
    turma_id?: number;
    data_inicio?: Date;
    data_fim?: Date;
  }): Promise<AttendanceWithDetails[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (filters?.aluno_id) {
      conditions.push(`p.aluno_id = $${idx++}`);
      params.push(filters.aluno_id);
    }

    if (filters?.turma_id) {
      conditions.push(`p.turma_id = $${idx++}`);
      params.push(filters.turma_id);
    }

    if (filters?.data_inicio) {
      conditions.push(`p.data >= $${idx++}`);
      params.push(filters.data_inicio);
    }

    if (filters?.data_fim) {
      conditions.push(`p.data <= $${idx++}`);
      params.push(filters.data_fim);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        p.*,
        a.nome_aluno AS aluno_nome,
        t.turma AS turma_nome
      FROM presencas p
      LEFT JOIN alunos a ON p.aluno_id = a.id_aluno
      LEFT JOIN turmas t ON p.turma_id = t.id_turma
      ${whereClause}
      ORDER BY p.data DESC, a.nome_aluno
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findByTurmaAndDate(turmaId: number, date: Date): Promise<AttendanceWithDetails[]> {
    const query = `
      SELECT 
        p.*,
        a.nome_aluno AS aluno_nome,
        t.turma AS turma_nome
      FROM presencas p
      JOIN alunos a ON p.aluno_id = a.id_aluno
      JOIN turmas t ON p.turma_id = t.id_turma
      WHERE p.turma_id = $1 AND p.data = $2
      ORDER BY a.nome_aluno
    `;

    const result = await pool.query(query, [turmaId, date]);
    return result.rows;
  }

  async findByStudent(alunoId: number, startDate?: Date, endDate?: Date): Promise<Attendance[]> {
    let query = 'SELECT * FROM presencas WHERE aluno_id = $1';
    const params: any[] = [alunoId];
    let idx = 2;

    if (startDate) {
      query += ` AND data >= $${idx++}`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND data <= $${idx++}`;
      params.push(endDate);
    }

    query += ' ORDER BY data DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  async create(data: CreateAttendanceDTO): Promise<Attendance> {
    const query = `
      INSERT INTO presencas (aluno_id, turma_id, classe_id, data, presente, observacao)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      data.aluno_id,
      data.turma_id || null,
      data.classe_id || null,
      data.data,
      data.presente,
      data.observacao || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async batchCreate(attendances: CreateAttendanceDTO[]): Promise<Attendance[]> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const created: Attendance[] = [];

      for (const attendance of attendances) {
        const result = await client.query(
          `INSERT INTO presencas (aluno_id, turma_id, classe_id, data, presente, observacao)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [
            attendance.aluno_id,
            attendance.turma_id || null,
            attendance.classe_id || null,
            attendance.data,
            attendance.presente,
            attendance.observacao || null,
          ]
        );
        created.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return created;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getAttendanceReport(turmaId: number, startDate: Date, endDate: Date) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_registros,
        COUNT(*) FILTER (WHERE presente = true) as presentes,
        COUNT(*) FILTER (WHERE presente = false) as ausentes,
        ROUND((COUNT(*) FILTER (WHERE presente = true)::numeric / NULLIF(COUNT(*), 0)) * 100, 2) as taxa_presenca
       FROM presencas
       WHERE turma_id = $1 AND data BETWEEN $2 AND $3`,
      [turmaId, startDate, endDate]
    );

    return result.rows[0];
  }

  async getStudentAttendanceStats(alunoId: number, startDate?: Date, endDate?: Date) {
    let query = `
      SELECT 
        COUNT(*) as total_aulas,
        COUNT(*) FILTER (WHERE presente = true) as presencas,
        COUNT(*) FILTER (WHERE presente = false) as faltas,
        ROUND((COUNT(*) FILTER (WHERE presente = true)::numeric / NULLIF(COUNT(*), 0)) * 100, 2) as taxa_presenca
      FROM presencas
      WHERE aluno_id = $1
    `;

    const params: any[] = [alunoId];
    let idx = 2;

    if (startDate) {
      query += ` AND data >= $${idx++}`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND data <= $${idx++}`;
      params.push(endDate);
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  }
}
