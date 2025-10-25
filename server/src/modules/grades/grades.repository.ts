import { pool } from '../../config/database';
import { Grade, GradeWithDetails, Boletim } from './grade.entity';
import { CreateGradeDTO, UpdateGradeDTO } from './dto';

export class GradesRepository {
  async findAll(filters?: { aluno_id?: number; disciplina_id?: number; trimestre?: number }): Promise<GradeWithDetails[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (filters?.aluno_id) {
      conditions.push(`n.aluno_id = $${idx++}`);
      params.push(filters.aluno_id);
    }
    if (filters?.disciplina_id) {
      conditions.push(`n.avaliacao_id = $${idx++}`);
      params.push(filters.disciplina_id);
    }
    if (filters?.trimestre) {
      conditions.push(`n.trimestre = $${idx++}`);
      params.push(filters.trimestre);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT n.*, a.nome_aluno, d.nome_disciplina
      FROM notas n
      LEFT JOIN alunos a ON n.aluno_id = a.id_aluno
      LEFT JOIN disciplinas d ON n.avaliacao_id = d.id_disciplinas
      ${whereClause}
      ORDER BY n.trimestre, a.nome_aluno
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findByStudent(alunoId: number, trimestre: string): Promise<GradeWithDetails[]> {
    const result = await pool.query(
      `SELECT n.*, a.nome_aluno, d.nome_disciplina
       FROM notas n
       LEFT JOIN alunos a ON n.aluno_id = a.id_aluno
       LEFT JOIN disciplinas d ON n.avaliacao_id = d.id_disciplinas
       WHERE n.aluno_id = $1 AND n.trimestre = $2
       ORDER BY d.nome_disciplina`,
      [alunoId, trimestre]
    );
    return result.rows;
  }

  async create(data: CreateGradeDTO): Promise<Grade> {
    const result = await pool.query(
      `INSERT INTO notas (aluno_id, avaliacao_id, valor, trimestre, periodo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.aluno_id, data.disciplina_id, parseFloat(String(data.valor)), data.trimestre, data.periodo || `${data.trimestre}º Trimestre`]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateGradeDTO): Promise<Grade> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.valor !== undefined) {
      fields.push(`valor = $${idx++}`);
      values.push(parseFloat(String(data.valor)));
    }
    if (data.trimestre !== undefined) {
      fields.push(`trimestre = $${idx++}`);
      values.push(data.trimestre);
    }
    if (data.periodo !== undefined) {
      fields.push(`periodo = $${idx++}`);
      values.push(data.periodo);
    }

    values.push(id);
    const result = await pool.query(`UPDATE notas SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return result.rows[0];
  }

  async getBoletim(alunoId: number, trimestre: number): Promise<Boletim> {
    const notasResult = await pool.query(
      `SELECT n.*, d.nome_disciplina FROM notas n
       JOIN disciplinas d ON n.avaliacao_id = d.id_disciplinas
       WHERE n.aluno_id = $1 AND n.trimestre = $2`,
      [alunoId, trimestre]
    );

    const alunoResult = await pool.query(`SELECT nome_aluno FROM alunos WHERE id_aluno = $1`, [alunoId]);
    if (alunoResult.rows.length === 0) throw new Error('Aluno não encontrado');

    const notas = notasResult.rows;
    const media = notas.length > 0 ? notas.reduce((sum, n) => sum + parseFloat(n.valor), 0) / notas.length : 0;

    return {
      aluno_id: alunoId,
      aluno_nome: alunoResult.rows[0].nome_aluno,
      trimestre,
      disciplinas: notas.map((n: any) => ({
        disciplina_id: n.avaliacao_id,
        disciplina_nome: n.nome_disciplina,
        nota: parseFloat(n.valor),
      })),
      media_geral: Math.round(media * 100) / 100,
    };
  }

  async getStudentsByTurma(turmaId: number): Promise<any[]> {
    const result = await pool.query(`SELECT id_aluno as id, nome_aluno as nome FROM alunos WHERE id_turma = $1 ORDER BY nome_aluno`, [turmaId]);
    return result.rows;
  }

  async getDisciplinas(): Promise<any[]> {
    const result = await pool.query(`SELECT id_disciplinas as id, nome_disciplina FROM disciplinas ORDER BY nome_disciplina`);
    return result.rows;
  }
}
