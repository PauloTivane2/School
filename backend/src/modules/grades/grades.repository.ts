import { pool } from '@config/database';

export interface CreateGradeDTO {
  aluno_id: number;
  disciplina_id: number;
  periodo: string;
  valor: string;
  trimestre: number;
}

export interface Grade {
  id: number;
  aluno_id: number;
  disciplina_id: number;
  periodo: string;
  valor: string;
  trimestre: number;
  created_at: Date;
  updated_at: Date;
}

export class GradesRepository {
  async create(data: CreateGradeDTO): Promise<Grade> {
    const result = await pool.query(
      `INSERT INTO notas (aluno_id, avaliacao_id, valor, trimestre, periodo, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
       RETURNING *`,
      [data.aluno_id, data.disciplina_id, parseFloat(data.valor), data.trimestre, data.periodo]
    );
    return result.rows[0];
  }

  async update(id: string, valor: string): Promise<Grade | null> {
    const result = await pool.query(
      `UPDATE notas 
       SET valor = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [parseFloat(valor), id]
    );
    return result.rows[0] || null;
  }

  async findByStudent(studentId: string, trimestre: string): Promise<Grade[]> {
    const result = await pool.query(
      `SELECT * FROM notas WHERE aluno_id = $1 AND trimestre = $2 ORDER BY id`,
      [studentId, trimestre]
    );
    return result.rows;
  }

  async findByStudentDisciplineTrimestre(
    alunoId: string,
    disciplinaId: string,
    trimestre: number
  ): Promise<Grade | null> {
    const result = await pool.query(
      `SELECT * FROM notas 
       WHERE aluno_id = $1 AND avaliacao_id = $2 AND trimestre = $3`,
      [alunoId, disciplinaId, trimestre]
    );
    return result.rows[0] || null;
  }
}
