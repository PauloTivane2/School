import { pool } from '@config/database';
import { CreateStudentDTO, UpdateStudentDTO } from './dto';

export interface Student {
  id: number;
  nome: string;
  data_nascimento: Date;
  genero: string;
  numero_identificacao: string;
  turma_id: number;
  encarregado_id: number;
  turma_nome?: string;
  encarregado_nome?: string;
  identification_number?: string;
}

export class StudentsRepository {
  async findAll(filters?: any): Promise<Student[]> {
    let query = `
      SELECT 
        a.id,
        a.nome,
        a.data_nascimento,
        a.genero,
        a.numero_identificacao,
        a.numero_identificacao as identification_number,
        a.turma_id,
        a.encarregado_id,
        t.nome as turma_nome,
        e.nome as encarregado_nome
      FROM alunos a
      LEFT JOIN turmas t ON a.turma_id = t.id
      LEFT JOIN encarregados e ON a.encarregado_id = e.id
    `;
    
    const conditions = [];
    const params = [];
    
    if (filters?.classId) {
      conditions.push(`a.turma_id = $${params.length + 1}`);
      params.push(filters.classId);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY a.nome';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id: string): Promise<Student | null> {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.nome,
        a.data_nascimento,
        a.genero,
        a.numero_identificacao,
        a.numero_identificacao as identification_number,
        a.turma_id,
        a.encarregado_id,
        t.nome as turma_nome,
        e.nome as encarregado_nome
      FROM alunos a
      LEFT JOIN turmas t ON a.turma_id = t.id
      LEFT JOIN encarregados e ON a.encarregado_id = e.id
      WHERE a.id = $1
    `, [id]);
    
    return result.rows[0] || null;
  }

  async findByIdentificationNumber(number: string): Promise<Student | null> {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.nome,
        a.data_nascimento,
        a.genero,
        a.numero_identificacao,
        a.numero_identificacao as identification_number,
        a.turma_id,
        a.encarregado_id
      FROM alunos a
      WHERE a.numero_identificacao = $1
    `, [number]);
    
    return result.rows[0] || null;
  }

  async create(data: CreateStudentDTO): Promise<Student> {
    const result = await pool.query(`
      INSERT INTO alunos (nome, data_nascimento, genero, numero_identificacao, turma_id, encarregado_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      data.name,
      data.dateOfBirth,
      data.gender,
      data.identificationNumber,
      parseInt(data.classId),
      data.guardianId ? parseInt(data.guardianId) : null
    ]);
    
    return result.rows[0];
  }

  async update(id: string, data: UpdateStudentDTO): Promise<Student> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`nome = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.dateOfBirth !== undefined) {
      fields.push(`data_nascimento = $${paramIndex++}`);
      values.push(data.dateOfBirth);
    }
    if (data.gender !== undefined) {
      fields.push(`genero = $${paramIndex++}`);
      values.push(data.gender);
    }
    if (data.identificationNumber !== undefined) {
      fields.push(`numero_identificacao = $${paramIndex++}`);
      values.push(data.identificationNumber);
    }
    if (data.classId !== undefined) {
      fields.push(`turma_id = $${paramIndex++}`);
      values.push(parseInt(data.classId));
    }
    if (data.guardianId !== undefined) {
      fields.push(`encarregado_id = $${paramIndex++}`);
      values.push(data.guardianId ? parseInt(data.guardianId) : null);
    }

    values.push(id);

    const result = await pool.query(`
      UPDATE alunos 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `, values);

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM alunos WHERE id = $1', [id]);
  }

  async count(): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) as total FROM alunos');
    return parseInt(result.rows[0].total);
  }
}