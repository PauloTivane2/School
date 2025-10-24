import { Request, Response } from 'express';
import { ClassesService } from './classes.service';
import { ApiResponse } from '../../shared/utils/response.util';
import { asyncHandler } from '../../middleware/error-handler.middleware';

export class ClassesController {
  private service: ClassesService;

  constructor() {
    this.service = new ClassesService();
  }

  // ===== CLASSES =====
  getAllClasses = asyncHandler(async (req: Request, res: Response) => {
    const classes = await this.service.findAllClasses();
    return ApiResponse.success(res, classes, 'Classes listadas com sucesso');
  });

  getClassById = asyncHandler(async (req: Request, res: Response) => {
    const classe = await this.service.findClassById(Number(req.params.id));
    return ApiResponse.success(res, classe);
  });

  createClass = asyncHandler(async (req: Request, res: Response) => {
    const classe = await this.service.createClass(req.body);
    return ApiResponse.created(res, classe, 'Classe criada com sucesso');
  });

  updateClass = asyncHandler(async (req: Request, res: Response) => {
    const classe = await this.service.updateClass(Number(req.params.id), req.body);
    return ApiResponse.success(res, classe, 'Classe atualizada com sucesso');
  });

  deleteClass = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteClass(Number(req.params.id));
    return ApiResponse.success(res, { ok: true }, 'Classe deletada com sucesso');
  });

  // ===== TURMAS =====
  getAllTurmas = asyncHandler(async (req: Request, res: Response) => {
    const { ano, classe_id } = req.query;
    const filters = {
      ano: ano ? Number(ano) : undefined,
      classe_id: classe_id ? Number(classe_id) : undefined,
    };
    const turmas = await this.service.findAllTurmas(filters);
    return ApiResponse.success(res, turmas, 'Turmas listadas com sucesso');
  });

  getTurmaById = asyncHandler(async (req: Request, res: Response) => {
    const turma = await this.service.findTurmaById(Number(req.params.id));
    return ApiResponse.success(res, turma);
  });

  createTurma = asyncHandler(async (req: Request, res: Response) => {
    const turma = await this.service.createTurma(req.body);
    return ApiResponse.created(res, turma, 'Turma criada com sucesso');
  });

  updateTurma = asyncHandler(async (req: Request, res: Response) => {
    const turma = await this.service.updateTurma(Number(req.params.id), req.body);
    return ApiResponse.success(res, turma, 'Turma atualizada com sucesso');
  });

  deleteTurma = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteTurma(Number(req.params.id));
    return ApiResponse.success(res, { ok: true }, 'Turma deletada com sucesso');
  });
}
