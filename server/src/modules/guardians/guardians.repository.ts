import { pool } from '../../config/database';
import { Guardian, GuardianWithRelations } from './guardian.entity';
import { CreateGuardianDTO, UpdateGuardianDTO, GuardianFilters } from './dto';

/**
 * Repository para operações de banco de dados relacionadas a Encarregados
 * RF02: Criar/editar/eliminar encarregado
 */
export class GuardiansRepository {
  /**
   * Buscar todos os encarregados com filtros
   */
  async findAll(filters: GuardianFilters = {}): Promise<GuardianWithRelations[]> {
    const params: any[] = [];
    let query = `
      SELECT 
        e.id_encarregados,
        e.nome,
        e.email,
        e.morada,
        c.contacto1,
        c.contacto2,
        c.contacto3,
        COUNT(DISTINCT a.id_aluno) as total_alunos
      FROM encarregados e
      LEFT JOIN contactos c ON e.id_encarregados = c.id_encarregados
      LEFT JOIN alunos a ON e.id_encarregados = a.id_encarregados
      WHERE 1=1
    `;

    // Filtro por pesquisa textual
    if (filters.q) {
      params.push(`%${filters.q}%`);
      query += ` AND (
        e.nome ILIKE $${params.length} OR
        e.email ILIKE $${params.length} OR
        e.morada ILIKE $${params.length} OR
        c.contacto1 ILIKE $${params.length} OR
        c.contacto2 ILIKE $${params.length} OR
        c.contacto3 ILIKE $${params.length}
      )`;
    }

    // Filtro por email
    if (filters.email) {
      params.push(filters.email);
      query += ` AND e.email = $${params.length}`;
    }

    query += ` GROUP BY e.id_encarregados, c.contacto1, c.contacto2, c.contacto3`;
    query += ` ORDER BY e.nome`;

    const result = await pool.query(query, params);

    return result.rows.map(row => ({
      id_encarregados: row.id_encarregados,
      nome: row.nome,
      email: row.email ?? '',
      morada: row.morada ?? '',
      contacto1: row.contacto1 ?? '',
      contacto2: row.contacto2 ?? '',
      contacto3: row.contacto3 ?? '',
      total_alunos: parseInt(row.total_alunos) || 0,
    }));
  }

  /**
   * Buscar encarregado por ID
   */
  async findById(id: number): Promise<Guardian | null> {
    const query = `
      SELECT 
        e.id_encarregados,
        e.nome,
        e.email,
        e.morada,
        c.contacto1,
        c.contacto2,
        c.contacto3
      FROM encarregados e
      LEFT JOIN contactos c ON e.id_encarregados = c.id_encarregados
      WHERE e.id_encarregados = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id_encarregados: row.id_encarregados,
      nome: row.nome,
      email: row.email ?? '',
      morada: row.morada ?? '',
      contacto1: row.contacto1 ?? '',
      contacto2: row.contacto2 ?? '',
      contacto3: row.contacto3 ?? '',
    };
  }

  /**
   * Criar novo encarregado com contactos
   */
  async create(data: CreateGuardianDTO): Promise<Guardian> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Inserir encarregado
      const guardianQuery = `
        INSERT INTO encarregados (nome, email, morada)
        VALUES ($1, $2, $3)
        RETURNING id_encarregados, nome, email, morada
      `;
      const guardianResult = await client.query(guardianQuery, [
        data.nome,
        data.email || null,
        data.morada || null,
      ]);

      const guardian = guardianResult.rows[0];

      // Inserir contactos
      if (data.contacto1) {
        const contactQuery = `
          INSERT INTO contactos (contacto1, contacto2, contacto3, id_encarregados)
          VALUES ($1, $2, $3, $4)
          RETURNING contacto1, contacto2, contacto3
        `;
        const contactResult = await client.query(contactQuery, [
          data.contacto1,
          data.contacto2 || null,
          data.contacto3 || null,
          guardian.id_encarregados,
        ]);

        guardian.contacto1 = contactResult.rows[0].contacto1;
        guardian.contacto2 = contactResult.rows[0].contacto2;
        guardian.contacto3 = contactResult.rows[0].contacto3;
      }

      await client.query('COMMIT');

      return {
        id_encarregados: guardian.id_encarregados,
        nome: guardian.nome,
        email: guardian.email ?? '',
        morada: guardian.morada ?? '',
        contacto1: guardian.contacto1 ?? '',
        contacto2: guardian.contacto2 ?? '',
        contacto3: guardian.contacto3 ?? '',
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Atualizar encarregado existente
   */
  async update(id: number, data: UpdateGuardianDTO): Promise<Guardian | null> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Atualizar encarregado
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (data.nome !== undefined) {
        updateFields.push(`nome = $${paramIndex++}`);
        updateValues.push(data.nome);
      }
      if (data.email !== undefined) {
        updateFields.push(`email = $${paramIndex++}`);
        updateValues.push(data.email || null);
      }
      if (data.morada !== undefined) {
        updateFields.push(`morada = $${paramIndex++}`);
        updateValues.push(data.morada || null);
      }

      if (updateFields.length > 0) {
        updateValues.push(id);
        const guardianQuery = `
          UPDATE encarregados
          SET ${updateFields.join(', ')}
          WHERE id_encarregados = $${paramIndex}
          RETURNING id_encarregados, nome, email, morada
        `;
        await client.query(guardianQuery, updateValues);
      }

      // Atualizar contactos
      if (data.contacto1 !== undefined || data.contacto2 !== undefined || data.contacto3 !== undefined) {
        // Verificar se existe registro de contacto
        const checkContact = await client.query(
          'SELECT id_contacto FROM contactos WHERE id_encarregados = $1',
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
              WHERE id_encarregados = $${contactParamIndex}
            `;
            await client.query(contactQuery, contactValues);
          }
        } else if (data.contacto1) {
          // Inserir novo contacto
          const contactQuery = `
            INSERT INTO contactos (contacto1, contacto2, contacto3, id_encarregados)
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

      // Buscar e retornar o encarregado atualizado
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
   * Deletar encarregado
   */
  async delete(id: number): Promise<boolean> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verificar se há alunos associados
      const checkStudents = await client.query(
        'SELECT COUNT(*) as count FROM alunos WHERE id_encarregados = $1',
        [id]
      );

      if (parseInt(checkStudents.rows[0].count) > 0) {
        throw new Error('Não é possível eliminar encarregado com alunos associados');
      }

      // Deletar contactos primeiro (cascade deve fazer isso automaticamente)
      await client.query('DELETE FROM contactos WHERE id_encarregados = $1', [id]);

      // Deletar encarregado
      const result = await client.query(
        'DELETE FROM encarregados WHERE id_encarregados = $1 RETURNING id_encarregados',
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
   * Contar encarregados
   */
  async count(filters: GuardianFilters = {}): Promise<number> {
    const params: any[] = [];
    let query = 'SELECT COUNT(DISTINCT e.id_encarregados) as total FROM encarregados e WHERE 1=1';

    if (filters.q) {
      params.push(`%${filters.q}%`);
      query += ` AND (e.nome ILIKE $${params.length} OR e.email ILIKE $${params.length})`;
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].total);
  }

  /**
   * Obter alunos de um encarregado específico
   * RN: Encarregado só vê seus próprios educandos
   */
  async getGuardianStudents(guardianId: number): Promise<any[]> {
    const query = `
      SELECT DISTINCT
        a.id_aluno,
        a.nome_aluno as nome,
        a.data_nascimento,
        a.genero,
        a.estado,
        t.turma as nome_turma,
        c.nome_classe as classe
      FROM alunos a
      LEFT JOIN turmas t ON a.id_turma = t.id_turma
      LEFT JOIN classes c ON t.id_classe = c.id_classes
      WHERE a.id_encarregados = $1
      ORDER BY a.nome_aluno
    `;

    const result = await pool.query(query, [guardianId]);
    return result.rows;
  }

  /**
   * Obter dashboard do encarregado
   */
  async getGuardianDashboard(guardianId: number): Promise<any> {
    // Buscar alunos
    const students = await this.getGuardianStudents(guardianId);

    // Buscar estatísticas resumidas
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT a.id_aluno) as total_alunos,
        COUNT(DISTINCT CASE WHEN p.estado = 'pendente' THEN p.id END) as pagamentos_pendentes,
        AVG(n.valor) as media_geral,
        SUM(CASE WHEN pr.presente = FALSE THEN 1 ELSE 0 END) as total_faltas
      FROM alunos a
      LEFT JOIN pagamentos p ON a.id_aluno = p.aluno_id
      LEFT JOIN notas n ON a.id_aluno = n.aluno_id
      LEFT JOIN presencas pr ON a.id_aluno = pr.aluno_id
      WHERE a.id_encarregados = $1
    `;

    const statsResult = await pool.query(statsQuery, [guardianId]);
    const stats = statsResult.rows[0];

    // Buscar alertas (pagamentos atrasados, faltas excessivas, notas baixas)
    const alertsQuery = `
      SELECT DISTINCT
        'pagamento' as tipo,
        a.nome_aluno as aluno_nome,
        'Pagamento pendente' as mensagem,
        p.data_pagamento as data
      FROM alunos a
      JOIN pagamentos p ON a.id_aluno = p.aluno_id
      WHERE a.id_encarregados = $1 AND p.estado = 'pendente'
      
      UNION ALL
      
      SELECT DISTINCT
        'falta' as tipo,
        a.nome_aluno as aluno_nome,
        'Faltas excessivas (' || COUNT(pr.id) || ' faltas)' as mensagem,
        MAX(pr.data) as data
      FROM alunos a
      JOIN presencas pr ON a.id_aluno = pr.aluno_id
      WHERE a.id_encarregados = $1 AND pr.presente = FALSE
      GROUP BY a.id_aluno, a.nome_aluno
      HAVING COUNT(pr.id) >= 5
      
      UNION ALL
      
      SELECT DISTINCT
        'nota' as tipo,
        a.nome_aluno as aluno_nome,
        'Nota baixa (' || n.valor || ')' as mensagem,
        av.data as data
      FROM alunos a
      JOIN notas n ON a.id_aluno = n.aluno_id
      JOIN avaliacoes av ON n.avaliacao_id = av.id
      WHERE a.id_encarregados = $1 AND n.valor < 10
      
      ORDER BY data DESC
      LIMIT 10
    `;

    const alertsResult = await pool.query(alertsQuery, [guardianId]);

    return {
      students,
      stats: {
        total_alunos: parseInt(stats.total_alunos) || 0,
        pagamentos_pendentes: parseInt(stats.pagamentos_pendentes) || 0,
        media_geral: parseFloat(stats.media_geral) || 0,
        total_faltas: parseInt(stats.total_faltas) || 0,
      },
      alerts: alertsResult.rows,
    };
  }

  /**
   * Verificar se um aluno pertence ao encarregado
   */
  async isStudentOwnedByGuardian(guardianId: number, studentId: number): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM alunos
      WHERE id_aluno = $1 AND id_encarregados = $2
    `;

    const result = await pool.query(query, [studentId, guardianId]);
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Obter notas de um aluno
   */
  async getStudentGrades(studentId: number): Promise<any[]> {
    const query = `
      SELECT 
        n.id,
        n.valor as nota,
        n.trimestre,
        av.data as data_lancamento,
        av.tipo as tipo_avaliacao,
        f.nome_funcionario as professor_nome
      FROM notas nö
      JOIN avaliacoes av ON n.avaliacao_id = av.id
      LEFT JOIN funcionarios f ON n.avaliador_id = f.id_funcionarios
      WHERE n.aluno_id = $1
      ORDER BY n.trimestre, av.data
    `;

    const result = await pool.query(query, [studentId]);
    return result.rows;
  }

  /**
   * Obter presenças de um aluno
   */
  async getStudentAttendance(studentId: number): Promise<any[]> {
    const query = `
      SELECT 
        pr.id,
        pr.data,
        pr.presente,
        pr.observacao,
        c.nome_classe
      FROM presencas pr
      LEFT JOIN classes c ON pr.classe_id = c.id_classes
      WHERE pr.aluno_id = $1
      ORDER BY pr.data DESC
      LIMIT 100
    `;

    const result = await pool.query(query, [studentId]);
    return result.rows;
  }

  /**
   * Obter pagamentos de um aluno
   */
  async getStudentPayments(studentId: number): Promise<any[]> {
    const query = `
      SELECT 
        p.id,
        p.valor,
        p.data_pagamento,
        p.estado,
        p.metodo,
        p.referencia
      FROM pagamentos p
      WHERE p.aluno_id = $1
      ORDER BY p.data_pagamento DESC
    `;

    const result = await pool.query(query, [studentId]);
    return result.rows;
  }

  /**
   * Obter exames de um aluno
   */
  async getStudentExams(studentId: number): Promise<any[]> {
    // Sistema não possui módulo de exames
    // Retornar array vazio por enquanto
    return [];
  }
}
