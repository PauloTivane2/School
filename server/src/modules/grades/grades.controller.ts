import { Request, Response } from 'express';
import { GradesService } from './grades.service';
import { ApiResponse } from '../../common/utils/response.util';
import { asyncHandler } from '../../core/middleware/error-handler.middleware';

export class GradesController {
  private service: GradesService;

  constructor() {
    this.service = new GradesService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { aluno_id, disciplina_id, trimestre } = req.query;
    const filters = {
      aluno_id: aluno_id ? Number(aluno_id) : undefined,
      disciplina_id: disciplina_id ? Number(disciplina_id) : undefined,
      trimestre: trimestre ? Number(trimestre) : undefined,
    };
    const grades = await this.service.findAll(filters);
    return ApiResponse.success(res, grades, 'Notas listadas com sucesso');
  });

  findByStudent = asyncHandler(async (req: Request, res: Response) => {
    const { aluno_id, trimestre } = req.query;
    if (!aluno_id || !trimestre) {
      return ApiResponse.badRequest(res, 'aluno_id e trimestre são obrigatórios');
    }
    const notas = await this.service.findByStudent(Number(aluno_id), trimestre.toString());
    return ApiResponse.success(res, notas);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const nota = await this.service.create(req.body);
    return ApiResponse.created(res, nota, 'Nota lançada com sucesso');
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const nota = await this.service.update(Number(req.params.id), req.body);
    return ApiResponse.success(res, nota, 'Nota atualizada com sucesso');
  });

  getBoletim = asyncHandler(async (req: Request, res: Response) => {
    const { aluno_id, trimestre } = req.query;
    if (!aluno_id || !trimestre) {
      return ApiResponse.badRequest(res, 'aluno_id e trimestre são obrigatórios');
    }
    const boletim = await this.service.getBoletim(Number(aluno_id), Number(trimestre));
    return ApiResponse.success(res, boletim, 'Boletim gerado com sucesso');
  });

  getStudentsByTurma = asyncHandler(async (req: Request, res: Response) => {
    const alunos = await this.service.getStudentsByTurma(Number(req.params.turmaId));
    return ApiResponse.success(res, alunos);
  });

  getDisciplinas = asyncHandler(async (_req: Request, res: Response) => {
    const disciplinas = await this.service.getDisciplinas();
    return ApiResponse.success(res, disciplinas, 'Disciplinas listadas com sucesso');
  });
}
