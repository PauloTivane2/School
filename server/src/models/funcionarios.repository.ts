import { pool } from '@config/database';

export interface CreateFuncionarioDTO {
  nome: string;
  papel: 'Professor' | 'Diretor' | 'Secretaria' | 'Admin';
  email?: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  papel: string;
  email?: string;
  ativo: boolean;
}

export class FuncionariosRepository {
  async findAll(): Promise<Funcionario[]> {
    const result = await pool.query('SELECT * FROM funcionarios ORDER BY id DESC');
    return result.rows;
  }

  async findById(id: number): Promise<Funcionario | null> {
    const result = await pool.query('SELECT * FROM funcionarios WHERE id=$1', [id]);
    return result.rows[0] || null;
  }

  async create(data: CreateFuncionarioDTO): Promise<Funcionario> {
    const result = await pool.query(
      `INSERT INTO funcionarios (nome, papel, email) VALUES ($1, $2, $3) RETURNING *`,
      [data.nome, data.papel, data.email]
    );
    return result.rows[0];
  }

  async update(id: number, data: Partial<CreateFuncionarioDTO> & { ativo?: boolean }): Promise<Funcionario | null> {
    const result = await pool.query(
      `UPDATE funcionarios SET nome=$1, papel=$2, email=$3, ativo=$4 WHERE id=$5 RETURNING *`,
      [data.nome, data.papel, data.email, data.ativo, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM funcionarios WHERE id=$1', [id]);
  }
}
