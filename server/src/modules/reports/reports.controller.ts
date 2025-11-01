import { Request, Response } from 'express';
import { ReportsService } from './reports.service';
import { ApiResponse } from '../../common/utils/response.util';
import { asyncHandler } from '../../core/middleware/error-handler.middleware';

/**
 * Controller para relatórios do sistema
 */
export class ReportsController {
  private service: ReportsService;

  constructor() {
    this.service = new ReportsService();
  }

  /**
   * GET /api/relatorios/financeiro
   * Relatório financeiro com filtros de período
   */
  getFinancialReport = asyncHandler(async (req: Request, res: Response) => {
    const { inicio, fim, turma_id } = req.query;

    if (!inicio || !fim) {
      return ApiResponse.error(res, 'Período (inicio e fim) é obrigatório', 400);
    }

    const report = await this.service.getFinancialReport({
      inicio: new Date(inicio as string),
      fim: new Date(fim as string),
      turma_id: turma_id ? Number(turma_id) : undefined
    });

    return ApiResponse.success(res, report, 'Relatório financeiro gerado');
  });

  /**
   * GET /api/relatorios/frequencia
   * Relatório de frequência/presenças
   */
  getAttendanceReport = asyncHandler(async (req: Request, res: Response) => {
    const { turmaId, inicio, fim } = req.query;

    if (!turmaId) {
      return ApiResponse.error(res, 'ID da turma é obrigatório', 400);
    }

    const report = await this.service.getAttendanceReport({
      turmaId: Number(turmaId),
      inicio: inicio ? new Date(inicio as string) : undefined,
      fim: fim ? new Date(fim as string) : undefined
    });

    return ApiResponse.success(res, report, 'Relatório de frequência gerado');
  });

  /**
   * GET /api/relatorios/academico
   * Relatório acadêmico (notas, desempenho)
   */
  getAcademicReport = asyncHandler(async (req: Request, res: Response) => {
    const { trimestre, turma_id, classe_id } = req.query;

    const report = await this.service.getAcademicReport({
      trimestre: trimestre ? Number(trimestre) : undefined,
      turma_id: turma_id ? Number(turma_id) : undefined,
      classe_id: classe_id ? Number(classe_id) : undefined
    });

    return ApiResponse.success(res, report, 'Relatório acadêmico gerado');
  });

  /**
   * GET /api/relatorios/boletim/:alunoId
   * Boletim individual do aluno
   */
  getStudentReport = asyncHandler(async (req: Request, res: Response) => {
    const { alunoId } = req.params;
    const { ano } = req.query;

    const boletim = await this.service.getStudentReport(
      Number(alunoId),
      ano ? Number(ano) : new Date().getFullYear()
    );

    return ApiResponse.success(res, boletim, 'Boletim gerado com sucesso');
  });

  /**
   * GET /api/relatorios/inadimplentes
   * Relatório de alunos inadimplentes
   */
  getDefaultersReport = asyncHandler(async (req: Request, res: Response) => {
    const { meses_atraso } = req.query;

    const report = await this.service.getDefaultersReport(
      meses_atraso ? Number(meses_atraso) : 1
    );

    return ApiResponse.success(res, report, 'Relatório de inadimplentes gerado');
  });

  /**
   * GET /api/relatorios/exames
   * Relatório de candidatos a exames
   */
  getExamCandidatesReport = asyncHandler(async (req: Request, res: Response) => {
    const { classe, ano } = req.query;

    const report = await this.service.getExamCandidatesReport({
      classe: classe as string,
      ano: ano ? Number(ano) : new Date().getFullYear()
    });

    return ApiResponse.success(res, report, 'Relatório de candidatos gerado');
  });

  /**
   * GET /api/relatorios/dashboard
   * Dados para dashboard (visão geral)
   */
  getDashboardData = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getDashboardData();
    return ApiResponse.success(res, data, 'Dados do dashboard obtidos');
  });
}
