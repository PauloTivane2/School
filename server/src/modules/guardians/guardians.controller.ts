import { Request, Response } from 'express';
import { GuardiansService } from './guardians.service';
import { ApiResponse } from '../../common/utils/response.util';
import { asyncHandler } from '../../core/middleware/error-handler.middleware';

/**
 * Controller para endpoints de encarregados
 * RF02: Criar/editar/eliminar encarregado
 * Implementa o padrão MVC
 */
export class GuardiansController {
  private service: GuardiansService;

  constructor() {
    this.service = new GuardiansService();
  }

  /**
   * GET /api/guardians
   * Listar todos os encarregados com filtros
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { q, email } = req.query;

    const filters = {
      q: q as string,
      email: email as string,
    };

    const guardians = await this.service.findAll(filters);
    return ApiResponse.success(res, guardians, 'Encarregados listados com sucesso');
  });

  /**
   * GET /api/guardians/:id
   * Buscar encarregado por ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const guardian = await this.service.findById(Number(id));
    return ApiResponse.success(res, guardian, 'Encarregado encontrado');
  });

  /**
   * POST /api/guardians
   * Criar novo encarregado
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const guardian = await this.service.create(req.body);
    return ApiResponse.created(res, guardian, 'Encarregado criado com sucesso');
  });

  /**
   * PUT /api/guardians/:id
   * Atualizar encarregado
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const guardian = await this.service.update(Number(id), req.body);
    return ApiResponse.success(res, guardian, 'Encarregado atualizado com sucesso');
  });

  /**
   * DELETE /api/guardians/:id
   * Deletar encarregado
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.delete(Number(id));
    return ApiResponse.success(res, { ok: true }, 'Encarregado deletado com sucesso');
  });

  /**
   * GET /api/guardians/count
   * Contar encarregados
   */
  count = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    const total = await this.service.count({ q: q as string });
    return ApiResponse.success(res, { total }, 'Contagem realizada com sucesso');
  });
}
