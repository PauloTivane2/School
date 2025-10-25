import { pool } from '../../config/database';
import { Student, StudentWithRelations } from './student.entity';
import { CreateStudentDTO, UpdateStudentDTO } from './dto';

/**
 * Repository para operações de banco de dados relacionadas a estudantes
 * Implementa o padrão Repository
 */
export class StudentsRepository {
  /**
   * Buscar todos os estudantes com filtros opcionais
   */
  async findAll(filters?: {
    q?: string;
    ano?: number;
    turma_id?: number;
    classe_id?: number;
    estado?: string;
  }): Promise<StudentWithRelations[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    // Filtro de busca por nome (aluno ou encarregado)
    if (filters?.q) {
      conditions.push(`(al.nome_aluno ILIKE '%' || $${idx} || '%' OR encar.nome ILIKE '%' || $${idx} || '%')`);
      params.push(filters.q);
      idx++;
    }

    // Filtro por ano
    if (filters?.ano) {
      conditions.push(`tur.ano = $${idx}`);
      params.push(filters.ano);
      idx++;
    }

    // Filtro por turma
    if (filters?.turma_id) {
      conditions.push(`tur.id_turma = $${idx}`);
      params.push(filters.turma_id);
      idx++;
    }

    // Filtro por classe
    if (filters?.classe_id) {
      conditions.push(`cls.id_classes = $${idx}`);
      params.push(filters.classe_id);
      idx++;
    }

    // Filtro por estado
    if (filters?.estado) {
      conditions.push(`al.estado = $${idx}`);
      params.push(filters.estado);
      idx++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        al.id_aluno,
        al.nome_aluno,
        al.data_nascimento,
        al.genero,
        al.bi,
        al.nuit,
        al.id_classe,
        al.id_turma,
        al.id_encarregados,
        al.estado,
        tur.id_turma AS turma_id,
        tur.turma AS turma_nome,
        cls.id_classes,
        cls.nome_classe AS classe_nome,
        encar.id_encarregados,
        encar.nome AS encarregado_nome
      FROM alunos al
      LEFT JOIN turmas tur ON al.id_turma = tur.id_turma
      LEFT JOIN classes cls ON al.id_classe = cls.id_classes
      LEFT JOIN encarregados encar ON al.id_encarregados = encar.id_encarregados
      ${whereClause}
      ORDER BY al.nome_aluno
      LIMIT 1000
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Buscar estudante por ID
   */
  async findById(id: number): Promise<StudentWithRelations | null> {
    const query = `
      SELECT 
        al.id_aluno,
        al.nome_aluno,
        al.data_nascimento,
        al.genero,
        al.bi,
        al.nuit,
        al.id_classe,
        al.id_turma,
        al.id_encarregados,
        al.estado,
        tur.id_turma AS turma_id,
        tur.turma AS turma_nome,
        cls.id_classes,
        cls.nome_classe AS classe_nome,
        encar.id_encarregados,
        encar.nome AS encarregado_nome
      FROM alunos al
      LEFT JOIN turmas tur ON al.id_turma = tur.id_turma
      LEFT JOIN classes cls ON al.id_classe = cls.id_classes
      LEFT JOIN encarregados encar ON al.id_encarregados = encar.id_encarregados
      WHERE al.id_aluno = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Buscar estudante por BI
   */
  async findByBI(bi: string): Promise<Student | null> {
    const result = await pool.query(
      'SELECT * FROM alunos WHERE bi = $1',
      [bi]
    );
    return result.rows[0] || null;
  }

  /**
   * Buscar estudante por NUIT
   */
  async findByNUIT(nuit: string): Promise<Student | null> {
    const result = await pool.query(
      'SELECT * FROM alunos WHERE nuit = $1',
      [nuit]
    );
    return result.rows[0] || null;
  }

  /**
   * Criar novo estudante
   */
  async create(data: CreateStudentDTO): Promise<Student> {
    const query = `
      INSERT INTO alunos (
        nome_aluno,
        data_nascimento,
        genero,
        bi,
        nuit,
        id_classe,
        id_turma,
        id_encarregados,
        estado
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      data.nome_aluno,
      data.data_nascimento,
      data.genero,
      data.bi || null,
      data.nuit || null,
      data.id_classe || null,
      data.id_turma || null,
      data.id_encarregados || null,
      data.estado || 'inativo',
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Atualizar estudante
   */
  async update(id: number, data: UpdateStudentDTO): Promise<Student> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.nome_aluno !== undefined) {
      fields.push(`nome_aluno = $${idx++}`);
      values.push(data.nome_aluno);
    }
    if (data.data_nascimento !== undefined) {
      fields.push(`data_nascimento = $${idx++}`);
      values.push(data.data_nascimento);
    }
    if (data.genero !== undefined) {
      fields.push(`genero = $${idx++}`);
      values.push(data.genero);
    }
    if (data.bi !== undefined) {
      fields.push(`bi = $${idx++}`);
      values.push(data.bi);
    }
    if (data.nuit !== undefined) {
      fields.push(`nuit = $${idx++}`);
      values.push(data.nuit);
    }
    if (data.id_classe !== undefined) {
      fields.push(`id_classe = $${idx++}`);
      values.push(data.id_classe);
    }
    if (data.id_turma !== undefined) {
      fields.push(`id_turma = $${idx++}`);
      values.push(data.id_turma);
    }
    if (data.id_encarregados !== undefined) {
      fields.push(`id_encarregados = $${idx++}`);
      values.push(data.id_encarregados);
    }
    if (data.estado !== undefined) {
      fields.push(`estado = $${idx++}`);
      values.push(data.estado);
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo para atualizar');
    }

    values.push(id);

    const query = `
      UPDATE alunos 
      SET ${fields.join(', ')}
      WHERE id_aluno = $${idx}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Deletar estudante
   */
  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM alunos WHERE id_aluno = $1', [id]);
  }

  /**
   * Contar estudantes
   */
  async count(filters?: any): Promise<number> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (filters?.estado) {
      conditions.push(`estado = $${idx++}`);
      params.push(filters.estado);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const result = await pool.query(
      `SELECT COUNT(*) as total FROM alunos ${whereClause}`,
      params
    );
    return parseInt(result.rows[0].total);
  }

  /**
   * Buscar estudantes por turma
   */
  async findByTurma(turmaId: number): Promise<Student[]> {
    const result = await pool.query(
      'SELECT * FROM alunos WHERE id_turma = $1 ORDER BY nome_aluno',
      [turmaId]
    );
    return result.rows;
  }
}
