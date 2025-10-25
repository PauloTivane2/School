import { Request, Response } from 'express';
import { AttendanceService } from './attendance.service';
import { ApiResponse } from '../../common/utils/response.util';
import { asyncHandler } from '../../core/middleware/error-handler.middleware';

export class AttendanceController {
  private service: AttendanceService;

  constructor() {
    this.service = new AttendanceService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { aluno_id, turma_id, data_inicio, data_fim } = req.query;

    const filters = {
      aluno_id: aluno_id ? Number(aluno_id) : undefined,
      turma_id: turma_id ? Number(turma_id) : undefined,
      data_inicio: data_inicio ? new Date(data_inicio as string) : undefined,
      data_fim: data_fim ? new Date(data_fim as string) : undefined,
    };

    const attendances = await this.service.findAll(filters);
    return ApiResponse.success(res, attendances, 'Presenças listadas com sucesso');
  });

  getByTurmaAndDate = asyncHandler(async (req: Request, res: Response) => {
    const { turmaId, date } = req.query;

    if (!turmaId || !date) {
      return ApiResponse.badRequest(res, 'turmaId e date são obrigatórios');
    }

    const attendances = await this.service.findByTurmaAndDate(
      Number(turmaId),
      new Date(date as string)
    );
    return ApiResponse.success(res, attendances);
  });

  getByStudent = asyncHandler(async (req: Request, res: Response) => {
    const { alunoId } = req.params;
    const { startDate, endDate } = req.query;

    const attendances = await this.service.findByStudent(
      Number(alunoId),
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    return ApiResponse.success(res, attendances);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const attendance = await this.service.create(req.body);
    return ApiResponse.created(res, attendance, 'Presença registrada com sucesso');
  });

  batchCreate = asyncHandler(async (req: Request, res: Response) => {
    const attendances = await this.service.batchCreate(req.body);
    return ApiResponse.created(res, attendances, `${attendances.length} presenças registradas com sucesso`);
  });

  getReport = asyncHandler(async (req: Request, res: Response) => {
    const { turmaId, startDate, endDate } = req.query;

    if (!turmaId || !startDate || !endDate) {
      return ApiResponse.badRequest(res, 'turmaId, startDate e endDate são obrigatórios');
    }

    const report = await this.service.getAttendanceReport(
      Number(turmaId),
      new Date(startDate as string),
      new Date(endDate as string)
    );
    return ApiResponse.success(res, report, 'Relatório gerado com sucesso');
  });

  getStudentStats = asyncHandler(async (req: Request, res: Response) => {
    const { alunoId } = req.params;
    const { startDate, endDate } = req.query;

    const stats = await this.service.getStudentAttendanceStats(
      Number(alunoId),
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    return ApiResponse.success(res, stats, 'Estatísticas geradas com sucesso');
  });
}
