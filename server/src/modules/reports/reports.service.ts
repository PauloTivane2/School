import { pool } from '../../config/database';
import { AppError } from '../../middleware/error-handler.middleware';

/**
 * Service para geração de relatórios
 */
export class ReportsService {
  /**
   * Relatório financeiro
   */
  async getFinancialReport(filters: {
    inicio: Date;
    fim: Date;
    turma_id?: number;
  }) {
    try {
      let query = `
        SELECT 
          COUNT(DISTINCT p.id_pagamento) as total_pagamentos,
          SUM(CASE WHEN p.estado = 'pago' THEN p.valor ELSE 0 END) as total_recebido,
          SUM(CASE WHEN p.estado = 'pendente' THEN p.valor ELSE 0 END) as total_pendente,
          SUM(CASE WHEN p.estado = 'atrasado' THEN p.valor ELSE 0 END) as total_atrasado,
          SUM(p.valor) as total_geral,
          COUNT(DISTINCT CASE WHEN p.estado = 'pago' THEN p.id_aluno END) as alunos_em_dia,
          COUNT(DISTINCT CASE WHEN p.estado != 'pago' THEN p.id_aluno END) as alunos_inadimplentes
        FROM pagamentos p
        WHERE p.data_vencimento BETWEEN $1 AND $2
      `;

      const params: any[] = [filters.inicio, filters.fim];

      if (filters.turma_id) {
        query += ' AND p.id_aluno IN (SELECT id_aluno FROM alunos WHERE id_turma = $3)';
        params.push(filters.turma_id);
      }

      const result = await pool.query(query, params);

      // Detalhamento por mês
      const monthlyQuery = `
        SELECT 
          TO_CHAR(p.data_vencimento, 'YYYY-MM') as mes,
          SUM(CASE WHEN p.estado = 'pago' THEN p.valor ELSE 0 END) as recebido,
          SUM(CASE WHEN p.estado = 'pendente' THEN p.valor ELSE 0 END) as pendente
        FROM pagamentos p
        WHERE p.data_vencimento BETWEEN $1 AND $2
        ${filters.turma_id ? 'AND p.id_aluno IN (SELECT id_aluno FROM alunos WHERE id_turma = $3)' : ''}
        GROUP BY TO_CHAR(p.data_vencimento, 'YYYY-MM')
        ORDER BY mes
      `;

      const monthlyResult = await pool.query(monthlyQuery, params);

      return {
        resumo: result.rows[0],
        por_mes: monthlyResult.rows,
        periodo: {
          inicio: filters.inicio,
          fim: filters.fim
        }
      };
    } catch (error) {
      console.error('Erro ao gerar relatório financeiro:', error);
      throw new AppError('Erro ao gerar relatório financeiro', 500);
    }
  }

  /**
   * Relatório de frequência
   */
  async getAttendanceReport(filters: {
    turmaId: number;
    inicio?: Date;
    fim?: Date;
  }) {
    try {
      const query = `
        SELECT 
          a.id_aluno,
          al.nome_aluno,
          COUNT(CASE WHEN a.estado = 'presente' THEN 1 END) as presencas,
          COUNT(CASE WHEN a.estado = 'falta' THEN 1 END) as faltas,
          COUNT(CASE WHEN a.estado = 'falta_justificada' THEN 1 END) as faltas_justificadas,
          COUNT(*) as total_aulas,
          ROUND(
            (COUNT(CASE WHEN a.estado = 'presente' THEN 1 END)::numeric / 
            NULLIF(COUNT(*), 0) * 100), 2
          ) as percentual_presenca
        FROM presencas a
        JOIN alunos al ON al.id_aluno = a.id_aluno
        WHERE al.id_turma = $1
        ${filters.inicio ? 'AND a.data >= $2' : ''}
        ${filters.fim ? `AND a.data <= $${filters.inicio ? 3 : 2}` : ''}
        GROUP BY a.id_aluno, al.nome_aluno
        ORDER BY al.nome_aluno
      `;

      const params: any[] = [filters.turmaId];
      if (filters.inicio) params.push(filters.inicio);
      if (filters.fim) params.push(filters.fim);

      const result = await pool.query(query, params);

      return {
        alunos: result.rows,
        turma_id: filters.turmaId,
        periodo: {
          inicio: filters.inicio,
          fim: filters.fim
        }
      };
    } catch (error) {
      console.error('Erro ao gerar relatório de frequência:', error);
      throw new AppError('Erro ao gerar relatório de frequência', 500);
    }
  }

  /**
   * Relatório acadêmico
   */
  async getAcademicReport(filters: {
    trimestre?: number;
    turma_id?: number;
    classe_id?: number;
  }) {
    try {
      let query = `
        SELECT 
          al.id_aluno,
          al.nome_aluno,
          t.turma,
          c.nome_classe,
          d.nome_disciplina,
          n.nota,
          n.trimestre,
          CASE 
            WHEN n.nota >= 10 THEN 'Aprovado'
            WHEN n.nota >= 7 THEN 'Em Recuperação'
            ELSE 'Reprovado'
          END as situacao
        FROM notas n
        JOIN alunos al ON al.id_aluno = n.id_aluno
        JOIN turmas t ON t.id_turma = al.id_turma
        JOIN classes c ON c.id_classes = t.id_classe
        JOIN disciplinas d ON d.id_disciplinas = n.id_disciplina
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (filters.trimestre) {
        query += ` AND n.trimestre = $${paramIndex}`;
        params.push(filters.trimestre);
        paramIndex++;
      }

      if (filters.turma_id) {
        query += ` AND al.id_turma = $${paramIndex}`;
        params.push(filters.turma_id);
        paramIndex++;
      }

      if (filters.classe_id) {
        query += ` AND t.id_classe = $${paramIndex}`;
        params.push(filters.classe_id);
        paramIndex++;
      }

      query += ' ORDER BY al.nome_aluno, d.nome_disciplina';

      const result = await pool.query(query, params);

      // Estatísticas gerais
      const statsQuery = `
        SELECT 
          COUNT(DISTINCT n.id_aluno) as total_alunos,
          ROUND(AVG(n.nota), 2) as media_geral,
          COUNT(CASE WHEN n.nota >= 10 THEN 1 END) as aprovados,
          COUNT(CASE WHEN n.nota < 10 THEN 1 END) as reprovados
        FROM notas n
        JOIN alunos al ON al.id_aluno = n.id_aluno
        WHERE 1=1
        ${filters.trimestre ? `AND n.trimestre = ${filters.trimestre}` : ''}
        ${filters.turma_id ? `AND al.id_turma = ${filters.turma_id}` : ''}
      `;

      const statsResult = await pool.query(statsQuery);

      return {
        notas: result.rows,
        estatisticas: statsResult.rows[0],
        filtros: filters
      };
    } catch (error) {
      console.error('Erro ao gerar relatório acadêmico:', error);
      throw new AppError('Erro ao gerar relatório acadêmico', 500);
    }
  }

  /**
   * Boletim do aluno
   */
  async getStudentReport(alunoId: number, ano: number) {
    try {
      const query = `
        SELECT 
          al.nome_aluno,
          al.numero_identificacao,
          t.turma,
          c.nome_classe,
          d.nome_disciplina,
          n.nota,
          n.trimestre,
          n.observacao
        FROM notas n
        JOIN alunos al ON al.id_aluno = n.id_aluno
        JOIN turmas t ON t.id_turma = al.id_turma
        JOIN classes c ON c.id_classes = t.id_classe
        JOIN disciplinas d ON d.id_disciplinas = n.id_disciplina
        WHERE n.id_aluno = $1 AND EXTRACT(YEAR FROM n.data_lancamento) = $2
        ORDER BY n.trimestre, d.nome_disciplina
      `;

      const result = await pool.query(query, [alunoId, ano]);

      if (result.rows.length === 0) {
        throw new AppError('Nenhuma nota encontrada para este aluno', 404);
      }

      // Calcular médias por trimestre
      const mediasPorTrimestre = await pool.query(`
        SELECT 
          trimestre,
          ROUND(AVG(nota), 2) as media
        FROM notas
        WHERE id_aluno = $1 AND EXTRACT(YEAR FROM data_lancamento) = $2
        GROUP BY trimestre
        ORDER BY trimestre
      `, [alunoId, ano]);

      return {
        aluno: {
          nome: result.rows[0].nome_aluno,
          numero_identificacao: result.rows[0].numero_identificacao,
          turma: result.rows[0].turma,
          classe: result.rows[0].nome_classe
        },
        notas: result.rows,
        medias_trimestre: mediasPorTrimestre.rows,
        ano
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Erro ao gerar boletim:', error);
      throw new AppError('Erro ao gerar boletim', 500);
    }
  }

  /**
   * Relatório de inadimplentes
   */
  async getDefaultersReport(mesesAtraso: number = 1) {
    try {
      const query = `
        SELECT 
          al.id_aluno,
          al.nome_aluno,
          al.numero_identificacao,
          t.turma,
          c.nome_classe,
          COUNT(p.id_pagamento) as meses_em_atraso,
          SUM(p.valor) as valor_total_devido,
          MIN(p.data_vencimento) as primeira_pendencia
        FROM alunos al
        JOIN turmas t ON t.id_turma = al.id_turma
        JOIN classes c ON c.id_classes = t.id_classe
        JOIN pagamentos p ON p.id_aluno = al.id_aluno
        WHERE p.estado IN ('pendente', 'atrasado')
          AND p.data_vencimento < CURRENT_DATE
        GROUP BY al.id_aluno, al.nome_aluno, al.numero_identificacao, t.turma, c.nome_classe
        HAVING COUNT(p.id_pagamento) >= $1
        ORDER BY COUNT(p.id_pagamento) DESC, al.nome_aluno
      `;

      const result = await pool.query(query, [mesesAtraso]);

      const totalDevido = result.rows.reduce((sum, row) => sum + parseFloat(row.valor_total_devido), 0);

      return {
        inadimplentes: result.rows,
        total_alunos: result.rows.length,
        total_devido: totalDevido,
        meses_minimo: mesesAtraso
      };
    } catch (error) {
      console.error('Erro ao gerar relatório de inadimplentes:', error);
      throw new AppError('Erro ao gerar relatório de inadimplentes', 500);
    }
  }

  /**
   * Relatório de candidatos a exames
   */
  async getExamCandidatesReport(filters: { classe: string; ano: number }) {
    try {
      const query = `
        SELECT 
          al.id_aluno,
          al.nome_aluno,
          al.numero_identificacao,
          al.data_nascimento,
          t.turma,
          c.nome_classe,
          ec.estado_candidatura,
          ec.data_inscricao,
          ec.valor_pago,
          CASE 
            WHEN ec.estado_candidatura = 'confirmado' THEN 'Confirmado'
            WHEN ec.estado_candidatura = 'pendente' THEN 'Pendente'
            ELSE 'Não Inscrito'
          END as status
        FROM alunos al
        JOIN turmas t ON t.id_turma = al.id_turma
        JOIN classes c ON c.id_classes = t.id_classe
        LEFT JOIN exames_candidaturas ec ON ec.id_aluno = al.id_aluno AND ec.ano = $2
        WHERE c.nome_classe = $1
        ORDER BY al.nome_aluno
      `;

      const result = await pool.query(query, [filters.classe, filters.ano]);

      const stats = {
        total_alunos: result.rows.length,
        confirmados: result.rows.filter(r => r.estado_candidatura === 'confirmado').length,
        pendentes: result.rows.filter(r => r.estado_candidatura === 'pendente').length,
        nao_inscritos: result.rows.filter(r => !r.estado_candidatura).length
      };

      return {
        candidatos: result.rows,
        estatisticas: stats,
        classe: filters.classe,
        ano: filters.ano
      };
    } catch (error) {
      console.error('Erro ao gerar relatório de candidatos:', error);
      throw new AppError('Erro ao gerar relatório de candidatos', 500);
    }
  }

  /**
   * Dados para dashboard
   */
  async getDashboardData() {
    try {
      const queries = {
        alunos: 'SELECT COUNT(*) as total FROM alunos WHERE estado = $1',
        funcionarios: 'SELECT COUNT(*) as total FROM funcionarios WHERE estado = $1',
        turmas: 'SELECT COUNT(*) as total FROM turmas',
        pagamentos_mes: `
          SELECT 
            SUM(CASE WHEN estado = 'pago' THEN valor ELSE 0 END) as recebido,
            SUM(CASE WHEN estado != 'pago' THEN valor ELSE 0 END) as pendente
          FROM pagamentos
          WHERE EXTRACT(MONTH FROM data_vencimento) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM data_vencimento) = EXTRACT(YEAR FROM CURRENT_DATE)
        `,
        presencas_hoje: `
          SELECT 
            COUNT(CASE WHEN estado = 'presente' THEN 1 END) as presentes,
            COUNT(CASE WHEN estado = 'falta' THEN 1 END) as faltas
          FROM presencas
          WHERE data = CURRENT_DATE
        `
      };

      const [alunos, funcionarios, turmas, pagamentos, presencas] = await Promise.all([
        pool.query(queries.alunos, ['ativo']),
        pool.query(queries.funcionarios, ['ativo']),
        pool.query(queries.turmas),
        pool.query(queries.pagamentos_mes),
        pool.query(queries.presencas_hoje)
      ]);

      return {
        total_alunos: parseInt(alunos.rows[0].total),
        total_funcionarios: parseInt(funcionarios.rows[0].total),
        total_turmas: parseInt(turmas.rows[0].total),
        financeiro_mes: pagamentos.rows[0],
        presencas_hoje: presencas.rows[0]
      };
    } catch (error) {
      console.error('Erro ao obter dados do dashboard:', error);
      throw new AppError('Erro ao obter dados do dashboard', 500);
    }
  }
}
