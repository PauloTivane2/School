import { pool } from '../../config/database';
import { Class, Turma, TurmaWithDetails } from './class.entity';
import { CreateClassDTO, CreateTurmaDTO, UpdateClassDTO, UpdateTurmaDTO } from './dto';

export class ClassesRepository {
  // ===== CLASSES =====
  async findAllClasses(): Promise<Class[]> {
    const result = await pool.query('SELECT * FROM classes ORDER BY nome_classe');
    return result.rows;
  }

  async findClassById(id: number): Promise<Class | null> {
    const result = await pool.query('SELECT * FROM classes WHERE id_classes = $1', [id]);
    return result.rows[0] || null;
  }

  async createClass(data: CreateClassDTO): Promise<Class> {
    const result = await pool.query(
      'INSERT INTO classes (nome_classe) VALUES ($1) RETURNING *',
      [data.nome_classe]
    );
    return result.rows[0];
  }

  async updateClass(id: number, data: UpdateClassDTO): Promise<Class> {
    const result = await pool.query(
      'UPDATE classes SET nome_classe = $1 WHERE id_classes = $2 RETURNING *',
      [data.nome_classe, id]
    );
    return result.rows[0];
  }

  async deleteClass(id: number): Promise<void> {
    await pool.query('DELETE FROM classes WHERE id_classes = $1', [id]);
  }

  // ===== TURMAS =====
  async findAllTurmas(filters?: { ano?: number; classe_id?: number }): Promise<TurmaWithDetails[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (filters?.ano) {
      conditions.push(`t.ano = $${idx++}`);
      params.push(filters.ano);
    }

    if (filters?.classe_id) {
      conditions.push(`t.id_classe = $${idx++}`);
      params.push(filters.classe_id);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        t.*,
        c.nome_classe,
        f.nome_funcionario AS diretor_nome,
        COUNT(a.id_aluno) AS total_alunos
      FROM turmas t
      LEFT JOIN classes c ON t.id_classe = c.id_classes
      LEFT JOIN funcionarios f ON t.id_diretor_turma = f.id_funcionarios
      LEFT JOIN alunos a ON a.id_turma = t.id_turma
      ${whereClause}
      GROUP BY t.id_turma, c.nome_classe, f.nome_funcionario
      ORDER BY t.ano DESC, t.turma
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findTurmaById(id: number): Promise<TurmaWithDetails | null> {
    const query = `
      SELECT 
        t.*,
        c.nome_classe,
        f.nome_funcionario AS diretor_nome,
        COUNT(a.id_aluno) AS total_alunos
      FROM turmas t
      LEFT JOIN classes c ON t.id_classe = c.id_classes
      LEFT JOIN funcionarios f ON t.id_diretor_turma = f.id_funcionarios
      LEFT JOIN alunos a ON a.id_turma = t.id_turma
      WHERE t.id_turma = $1
      GROUP BY t.id_turma, c.nome_classe, f.nome_funcionario
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async createTurma(data: CreateTurmaDTO): Promise<Turma> {
    const result = await pool.query(
      `INSERT INTO turmas (turma, id_classe, ano, id_diretor_turma)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.turma, data.id_classe || null, data.ano, data.id_diretor_turma || null]
    );
    return result.rows[0];
  }

  async updateTurma(id: number, data: UpdateTurmaDTO): Promise<Turma> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.turma !== undefined) {
      fields.push(`turma = $${idx++}`);
      values.push(data.turma);
    }
    if (data.id_classe !== undefined) {
      fields.push(`id_classe = $${idx++}`);
      values.push(data.id_classe);
    }
    if (data.ano !== undefined) {
      fields.push(`ano = $${idx++}`);
      values.push(data.ano);
    }
    if (data.id_diretor_turma !== undefined) {
      fields.push(`id_diretor_turma = $${idx++}`);
      values.push(data.id_diretor_turma);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE turmas SET ${fields.join(', ')} WHERE id_turma = $${idx} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async deleteTurma(id: number): Promise<void> {
    await pool.query('DELETE FROM turmas WHERE id_turma = $1', [id]);
  }
}
