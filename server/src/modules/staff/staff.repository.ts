import { pool } from '../../config/database';
import { Staff, StaffWithRelations } from './staff.entity';
import { CreateStaffDTO, UpdateStaffDTO, StaffFilters } from './dto';
import * as bcrypt from 'bcryptjs';

/**
 * Repository para operações de banco de dados relacionadas a Funcionários
 * RF03: Criar/editar/eliminar funcionário/docente
 */
export class StaffRepository {
  /**
   * Buscar todos os funcionários com filtros
   */
  async findAll(filters: StaffFilters = {}): Promise<StaffWithRelations[]> {
    const params: any[] = [];
    let query = `
      SELECT 
        f.id_funcionarios,
        f.nome_funcionario,
        f.bi,
        f.nuit,
        f.nivel_academico,
        f.funcao,
        f.email,
        f.estado,
        c.contacto1,
        c.contacto2,
        c.contacto3
      FROM funcionarios f
      LEFT JOIN contactos c ON f.id_funcionarios = c.id_funcionarios
      WHERE 1=1
    `;

    // Filtro por função
    if (filters.funcao) {
      params.push(filters.funcao);
      query += ` AND f.funcao = $${params.length}`;
    }

    // Filtro por estado
    if (filters.estado) {
      params.push(filters.estado);
      query += ` AND f.estado = $${params.length}`;
    }

    // Filtro por pesquisa textual
    if (filters.q) {
      params.push(`%${filters.q}%`);
      query += ` AND (
        f.nome_funcionario ILIKE $${params.length} OR
        f.email ILIKE $${params.length} OR
        f.bi ILIKE $${params.length} OR
        f.nuit ILIKE $${params.length} OR
        c.contacto1 ILIKE $${params.length} OR
        c.contacto2 ILIKE $${params.length} OR
        c.contacto3 ILIKE $${params.length}
      )`;
    }

    // Filtro por email
    if (filters.email) {
      params.push(filters.email);
      query += ` AND f.email = $${params.length}`;
    }

    query += ` ORDER BY f.nome_funcionario`;

    const result = await pool.query(query, params);

    return result.rows.map(row => ({
      id_funcionarios: row.id_funcionarios,
      nome_funcionario: row.nome_funcionario,
      bi: row.bi ?? '',
      nuit: row.nuit ?? '',
      nivel_academico: row.nivel_academico ?? '',
      funcao: row.funcao,
      email: row.email ?? '',
      estado: row.estado,
      contacto1: row.contacto1 ?? '',
      contacto2: row.contacto2 ?? '',
      contacto3: row.contacto3 ?? '',
    }));
  }

  /**
   * Buscar funcionário por ID
   */
  async findById(id: number): Promise<Staff | null> {
    const query = `
      SELECT 
        f.id_funcionarios,
        f.nome_funcionario,
        f.bi,
        f.nuit,
        f.nivel_academico,
        f.funcao,
        f.email,
        f.estado,
        c.contacto1,
        c.contacto2,
        c.contacto3
      FROM funcionarios f
      LEFT JOIN contactos c ON f.id_funcionarios = c.id_funcionarios
      WHERE f.id_funcionarios = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id_funcionarios: row.id_funcionarios,
      nome_funcionario: row.nome_funcionario,
      bi: row.bi ?? '',
      nuit: row.nuit ?? '',
      nivel_academico: row.nivel_academico ?? '',
      funcao: row.funcao,
      email: row.email ?? '',
      estado: row.estado,
      contacto1: row.contacto1 ?? '',
      contacto2: row.contacto2 ?? '',
      contacto3: row.contacto3 ?? '',
    };
  }

  /**
   * Criar novo funcionário com contactos
   */
  async create(data: CreateStaffDTO): Promise<Staff> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Hash da senha (usar senha fornecida ou padrão '123456')
      const senha = data.senha || '123456';
      const senhaHash = await bcrypt.hash(senha, 10);

      // Inserir funcionário
      const staffQuery = `
        INSERT INTO funcionarios 
        (nome_funcionario, bi, nuit, nivel_academico, funcao, email, estado, senha_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id_funcionarios, nome_funcionario, bi, nuit, nivel_academico, funcao, email, estado
      `;
      const staffResult = await client.query(staffQuery, [
        data.nome_funcionario,
        data.bi || null,
        data.nuit || null,
        data.nivel_academico || null,
        data.funcao,
        data.email || null,
        data.estado || 'inativo',
        senhaHash,
      ]);

      const staff = staffResult.rows[0];

      // Inserir contactos
      if (data.contacto1) {
        const contactQuery = `
          INSERT INTO contactos (contacto1, contacto2, contacto3, id_funcionarios)
          VALUES ($1, $2, $3, $4)
          RETURNING contacto1, contacto2, contacto3
        `;
        const contactResult = await client.query(contactQuery, [
          data.contacto1,
          data.contacto2 || null,
          data.contacto3 || null,
          staff.id_funcionarios,
        ]);

        staff.contacto1 = contactResult.rows[0].contacto1;
        staff.contacto2 = contactResult.rows[0].contacto2;
        staff.contacto3 = contactResult.rows[0].contacto3;
      }

      await client.query('COMMIT');

      return {
        id_funcionarios: staff.id_funcionarios,
        nome_funcionario: staff.nome_funcionario,
        bi: staff.bi ?? '',
        nuit: staff.nuit ?? '',
        nivel_academico: staff.nivel_academico ?? '',
        funcao: staff.funcao,
        email: staff.email ?? '',
        estado: staff.estado,
        contacto1: staff.contacto1 ?? '',
        contacto2: staff.contacto2 ?? '',
        contacto3: staff.contacto3 ?? '',
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Atualizar funcionário existente
   */
  async update(id: number, data: UpdateStaffDTO): Promise<Staff | null> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Atualizar funcionário
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (data.nome_funcionario !== undefined) {
        updateFields.push(`nome_funcionario = $${paramIndex++}`);
        updateValues.push(data.nome_funcionario);
      }
      if (data.bi !== undefined) {
        updateFields.push(`bi = $${paramIndex++}`);
        updateValues.push(data.bi || null);
      }
      if (data.nuit !== undefined) {
        updateFields.push(`nuit = $${paramIndex++}`);
        updateValues.push(data.nuit || null);
      }
      if (data.nivel_academico !== undefined) {
        updateFields.push(`nivel_academico = $${paramIndex++}`);
        updateValues.push(data.nivel_academico || null);
      }
      if (data.funcao !== undefined) {
        updateFields.push(`funcao = $${paramIndex++}`);
        updateValues.push(data.funcao);
      }
      if (data.email !== undefined) {
        updateFields.push(`email = $${paramIndex++}`);
        updateValues.push(data.email || null);
      }
      if (data.estado !== undefined) {
        updateFields.push(`estado = $${paramIndex++}`);
        updateValues.push(data.estado);
      }
      if (data.senha !== undefined && data.senha !== '') {
        const senhaHash = await bcrypt.hash(data.senha, 10);
        updateFields.push(`senha_hash = $${paramIndex++}`);
        updateValues.push(senhaHash);
      }

      if (updateFields.length > 0) {
        updateValues.push(id);
        const staffQuery = `
          UPDATE funcionarios
          SET ${updateFields.join(', ')}
          WHERE id_funcionarios = $${paramIndex}
          RETURNING id_funcionarios, nome_funcionario, bi, nuit, nivel_academico, funcao, email, estado
        `;
        await client.query(staffQuery, updateValues);
      }

      // Atualizar contactos
      if (data.contacto1 !== undefined || data.contacto2 !== undefined || data.contacto3 !== undefined) {
        // Verificar se existe registro de contacto
        const checkContact = await client.query(
          'SELECT id_contacto FROM contactos WHERE id_funcionarios = $1',
          [id]
        );

        if (checkContact.rows.length > 0) {
          // Atualizar contacto existente
          const contactFields: string[] = [];
          const contactValues: any[] = [];
          let contactParamIndex = 1;

          if (data.contacto1 !== undefined) {
            contactFields.push(`contacto1 = $${contactParamIndex++}`);
            contactValues.push(data.contacto1);
          }
          if (data.contacto2 !== undefined) {
            contactFields.push(`contacto2 = $${contactParamIndex++}`);
            contactValues.push(data.contacto2 || null);
          }
          if (data.contacto3 !== undefined) {
            contactFields.push(`contacto3 = $${contactParamIndex++}`);
            contactValues.push(data.contacto3 || null);
          }

          if (contactFields.length > 0) {
            contactValues.push(id);
            const contactQuery = `
              UPDATE contactos
              SET ${contactFields.join(', ')}
              WHERE id_funcionarios = $${contactParamIndex}
            `;
            await client.query(contactQuery, contactValues);
          }
        } else if (data.contacto1) {
          // Inserir novo contacto
          const contactQuery = `
            INSERT INTO contactos (contacto1, contacto2, contacto3, id_funcionarios)
            VALUES ($1, $2, $3, $4)
          `;
          await client.query(contactQuery, [
            data.contacto1,
            data.contacto2 || null,
            data.contacto3 || null,
            id,
          ]);
        }
      }

      await client.query('COMMIT');

      // Buscar e retornar o funcionário atualizado
      const result = await this.findById(id);
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Deletar funcionário
   */
  async delete(id: number): Promise<boolean> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verificar se há turmas associadas
      const checkClasses = await client.query(
        'SELECT COUNT(*) as count FROM turmas WHERE id_diretor_turma = $1',
        [id]
      );

      if (parseInt(checkClasses.rows[0].count) > 0) {
        throw new Error('Não é possível eliminar funcionário com turmas associadas');
      }

      // Deletar contactos primeiro (cascade deve fazer isso automaticamente)
      await client.query('DELETE FROM contactos WHERE id_funcionarios = $1', [id]);

      // Deletar funcionário
      const result = await client.query(
        'DELETE FROM funcionarios WHERE id_funcionarios = $1 RETURNING id_funcionarios',
        [id]
      );

      await client.query('COMMIT');

      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Contar funcionários
   */
  async count(filters: StaffFilters = {}): Promise<number> {
    const params: any[] = [];
    let query = 'SELECT COUNT(DISTINCT f.id_funcionarios) as total FROM funcionarios f WHERE 1=1';

    if (filters.funcao) {
      params.push(filters.funcao);
      query += ` AND f.funcao = $${params.length}`;
    }

    if (filters.estado) {
      params.push(filters.estado);
      query += ` AND f.estado = $${params.length}`;
    }

    if (filters.q) {
      params.push(`%${filters.q}%`);
      query += ` AND (f.nome_funcionario ILIKE $${params.length} OR f.email ILIKE $${params.length})`;
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].total);
  }

  /**
   * Validar credenciais de login
   */
  async validateCredentials(email: string, senha: string): Promise<Staff | null> {
    const query = `
      SELECT 
        f.id_funcionarios,
        f.nome_funcionario,
        f.funcao,
        f.email,
        f.estado,
        f.senha_hash
      FROM funcionarios f
      WHERE f.email = $1 AND f.estado = 'ativo'
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    const staff = result.rows[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, staff.senha_hash);

    if (!senhaValida) {
      return null;
    }

    return {
      id_funcionarios: staff.id_funcionarios,
      nome_funcionario: staff.nome_funcionario,
      funcao: staff.funcao,
      email: staff.email,
      estado: staff.estado,
    };
  }
}
