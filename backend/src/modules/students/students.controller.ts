import { Request, Response, NextFunction } from 'express';
import { StudentsService } from './students.service';
import { ApiResponse } from '../../shared/utils/response.util';
import { asyncHandler } from '../../middleware/error-handler.middleware';

/**
 * Controller para endpoints de estudantes
 * Implementa o padrão MVC
 */
export class StudentsController {
  private service: StudentsService;

  constructor() {
    this.service = new StudentsService();
  }

  /**
   * GET /api/students
   * Listar todos os estudantes com filtros
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { q, ano, turma_id, classe_id, estado } = req.query;

    const filters = {
      q: q as string,
      ano: ano ? Number(ano) : undefined,
      turma_id: turma_id ? Number(turma_id) : undefined,
      classe_id: classe_id ? Number(classe_id) : undefined,
      estado: estado as string,
    };

    const students = await this.service.findAll(filters);
    return ApiResponse.success(res, students, 'Estudantes listados com sucesso');
  });

  /**
   * GET /api/students/:id
   * Buscar estudante por ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await this.service.findById(Number(id));
    return ApiResponse.success(res, student, 'Estudante encontrado');
  });

  /**
   * POST /api/students
   * Criar novo estudante
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const student = await this.service.create(req.body);
    return ApiResponse.created(res, student, 'Estudante criado com sucesso');
  });

  /**
   * PUT /api/students/:id
   * Atualizar estudante
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await this.service.update(Number(id), req.body);
    return ApiResponse.success(res, student, 'Estudante atualizado com sucesso');
  });

  /**
   * DELETE /api/students/:id
   * Deletar estudante
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.delete(Number(id));
    return ApiResponse.success(res, { ok: true }, 'Estudante deletado com sucesso');
  });

  /**
   * GET /api/students/count
   * Contar estudantes
   */
  count = asyncHandler(async (req: Request, res: Response) => {
    const { estado } = req.query;
    const total = await this.service.count({ estado });
    return ApiResponse.success(res, { total }, 'Contagem realizada com sucesso');
  });

  /**
   * GET /api/students/turma/:turmaId
   * Buscar estudantes por turma
   */
  getByTurma = asyncHandler(async (req: Request, res: Response) => {
    const { turmaId } = req.params;
    const students = await this.service.findByTurma(Number(turmaId));
    return ApiResponse.success(res, students, 'Estudantes da turma listados com sucesso');
  });
}
