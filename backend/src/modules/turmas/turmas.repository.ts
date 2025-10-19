import { pool } from '@config/database';

export interface CreateTurmaDTO {
  nome: string;
  ano_letivo: number;
  nivel: string;
  diretor_turma_id?: number;
}

export interface Turma {
  id: number;
  nome: string;
  ano_letivo: number;
  nivel: string;
  diretor_turma_id?: number;
}

export class TurmasRepository {
  async findAll(): Promise<Turma[]> {
    const result = await pool.query('SELECT * FROM turmas ORDER BY id DESC');
    return result.rows;
  }

  async findById(id: number): Promise<Turma | null> {
    const result = await pool.query('SELECT * FROM turmas WHERE id=$1', [id]);
    return result.rows[0] || null;
  }

  async create(data: CreateTurmaDTO): Promise<Turma> {
    const result = await pool.query(
      `INSERT INTO turmas (nome, ano_letivo, nivel, diretor_turma_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.nome, data.ano_letivo, data.nivel, data.diretor_turma_id]
    );
    return result.rows[0];
  }

  async update(id: number, data: Partial<CreateTurmaDTO>): Promise<Turma | null> {
    const result = await pool.query(
      `UPDATE turmas SET nome=$1, ano_letivo=$2, nivel=$3, diretor_turma_id=$4 WHERE id=$5 RETURNING *`,
      [data.nome, data.ano_letivo, data.nivel, data.diretor_turma_id, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM turmas WHERE id=$1', [id]);
  }
}
