import { Request, Response } from 'express';
import { StaffService } from './staff.service';
import { ApiResponse } from '../../common/utils/response.util';
import { asyncHandler } from '../../core/middleware/error-handler.middleware';

/**
 * Controller para endpoints de funcionários
 * RF03: Criar/editar/eliminar funcionário/docente
 * Implementa o padrão MVC
 */
export class StaffController {
  private service: StaffService;

  constructor() {
    this.service = new StaffService();
  }

  /**
   * GET /api/staff
   * Listar todos os funcionários com filtros
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { q, funcao, estado, email } = req.query;

    const filters = {
      q: q as string,
      funcao: funcao as any,
      estado: estado as any,
      email: email as string,
    };

    const staff = await this.service.findAll(filters);
    return ApiResponse.success(res, staff, 'Funcionários listados com sucesso');
  });

  /**
   * GET /api/staff/:id
   * Buscar funcionário por ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const staff = await this.service.findById(Number(id));
    return ApiResponse.success(res, staff, 'Funcionário encontrado');
  });

  /**
   * POST /api/staff
   * Criar novo funcionário
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const staff = await this.service.create(req.body);
    return ApiResponse.created(res, staff, 'Funcionário criado com sucesso');
  });

  /**
   * PUT /api/staff/:id
   * Atualizar funcionário
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const staff = await this.service.update(Number(id), req.body);
    return ApiResponse.success(res, staff, 'Funcionário atualizado com sucesso');
  });

  /**
   * DELETE /api/staff/:id
   * Deletar funcionário
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.delete(Number(id));
    return ApiResponse.success(res, { ok: true }, 'Funcionário deletado com sucesso');
  });

  /**
   * GET /api/staff/count
   * Contar funcionários
   */
  count = asyncHandler(async (req: Request, res: Response) => {
    const { funcao, estado, q } = req.query;
    const total = await this.service.count({ 
      funcao: funcao as any, 
      estado: estado as any,
      q: q as string
    });
    return ApiResponse.success(res, { total }, 'Contagem realizada com sucesso');
  });

  /**
   * POST /api/staff/authenticate
   * Autenticar funcionário
   */
  authenticate = asyncHandler(async (req: Request, res: Response) => {
    const { email, senha } = req.body;
    const staff = await this.service.authenticate(email, senha);
    return ApiResponse.success(res, staff, 'Autenticação bem-sucedida');
  });
}
