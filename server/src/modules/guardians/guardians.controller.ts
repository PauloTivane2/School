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

  /**
   * GET /api/guardians/meus-alunos
   * Listar APENAS os alunos do encarregado logado
   * RN: Encarregado só vê seus próprios educandos
   */
  getMyStudents = asyncHandler(async (req: Request, res: Response) => {
    const guardianId = (req as any).user?.userId;
    
    if (!guardianId) {
      return ApiResponse.error(res, 'Usuário não identificado', 401);
    }

    const students = await this.service.getGuardianStudents(guardianId);
    return ApiResponse.success(res, students, 'Alunos do encarregado listados com sucesso');
  });

  /**
   * GET /api/guardians/dashboard
   * Dashboard personalizado do encarregado
   * Contém: resumo dos alunos, alertas, próximos eventos
   */
  getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const guardianId = (req as any).user?.userId;
    
    if (!guardianId) {
      return ApiResponse.error(res, 'Usuário não identificado', 401);
    }

    const dashboard = await this.service.getGuardianDashboard(guardianId);
    return ApiResponse.success(res, dashboard, 'Dashboard do encarregado carregado com sucesso');
  });

  /**
   * GET /api/guardians/aluno/:studentId/notas
   * Ver notas de um aluno específico (apenas se for seu educando)
   */
  getStudentGrades = asyncHandler(async (req: Request, res: Response) => {
    const guardianId = (req as any).user?.userId;
    const { studentId } = req.params;
    
    if (!guardianId) {
      return ApiResponse.error(res, 'Usuário não identificado', 401);
    }

    const grades = await this.service.getStudentGrades(guardianId, Number(studentId));
    return ApiResponse.success(res, grades, 'Notas do aluno carregadas com sucesso');
  });

  /**
   * GET /api/guardians/aluno/:studentId/presencas
   * Ver presenças de um aluno específico (apenas se for seu educando)
   */
  getStudentAttendance = asyncHandler(async (req: Request, res: Response) => {
    const guardianId = (req as any).user?.userId;
    const { studentId } = req.params;
    
    if (!guardianId) {
      return ApiResponse.error(res, 'Usuário não identificado', 401);
    }

    const attendance = await this.service.getStudentAttendance(guardianId, Number(studentId));
    return ApiResponse.success(res, attendance, 'Presenças do aluno carregadas com sucesso');
  });

  /**
   * GET /api/guardians/aluno/:studentId/pagamentos
   * Ver pagamentos de um aluno específico (apenas se for seu educando)
   */
  getStudentPayments = asyncHandler(async (req: Request, res: Response) => {
    const guardianId = (req as any).user?.userId;
    const { studentId } = req.params;
    
    if (!guardianId) {
      return ApiResponse.error(res, 'Usuário não identificado', 401);
    }

    const payments = await this.service.getStudentPayments(guardianId, Number(studentId));
    return ApiResponse.success(res, payments, 'Pagamentos do aluno carregados com sucesso');
  });

  /**
   * GET /api/guardians/aluno/:studentId/exames
   * Ver exames de um aluno específico (apenas se for seu educando)
   */
  getStudentExams = asyncHandler(async (req: Request, res: Response) => {
    const guardianId = (req as any).user?.userId;
    const { studentId } = req.params;
    
    if (!guardianId) {
      return ApiResponse.error(res, 'Usuário não identificado', 401);
    }

    const exams = await this.service.getStudentExams(guardianId, Number(studentId));
    return ApiResponse.success(res, exams, 'Exames do aluno carregados com sucesso');
  });

  /**
   * POST /api/guardians/aluno/:studentId/exportar
   * Exportar relatório de um aluno em PDF
   */
  exportStudentReport = asyncHandler(async (req: Request, res: Response) => {
    const guardianId = (req as any).user?.userId;
    const { studentId } = req.params;
    const { type } = req.body; // 'completo', 'presencas', 'pagamentos'
    
    if (!guardianId) {
      return ApiResponse.error(res, 'Usuário não identificado', 401);
    }

    await this.service.exportStudentReport(guardianId, Number(studentId), type, res);
  });

  /**
   * POST /api/guardians/pagamento/mpesa
   * Processar pagamento M-Pesa para mensalidade de aluno
   */
  processMpesaPayment = asyncHandler(async (req: Request, res: Response) => {
    const guardianId = (req as any).user?.userId;
    const { studentId, amount, msisdn, walletId, reference } = req.body;
    
    if (!guardianId) {
      return ApiResponse.error(res, 'Usuário não identificado', 401);
    }

    const result = await this.service.processMpesaPayment(
      guardianId,
      Number(studentId),
      amount,
      msisdn,
      walletId,
      reference
    );
    
    if (result.success) {
      return ApiResponse.success(res, result.data, 'Pagamento processado com sucesso');
    } else {
      return ApiResponse.error(res, result.error || 'Erro ao processar pagamento', 400);
    }
  });

  /**
   * GET /api/guardians/pagamento/carteiras
   * Obter carteiras M-Pesa disponíveis
   */
  getMpesaWallets = asyncHandler(async (req: Request, res: Response) => {
    try {
      const result = await this.service.getMpesaWallets();
      
      console.log('📱 M-Pesa Wallets Result:', result);
      
      if (result.success) {
        // result.wallets já contém o array de carteiras da API M-Pesa
        return ApiResponse.success(res, result.wallets || [], 'Carteiras obtidas com sucesso');
      } else {
        console.error('❌ Erro ao obter carteiras:', result.error);
        return ApiResponse.error(res, result.error || 'Erro ao obter carteiras', 400);
      }
    } catch (error: any) {
      console.error('❌ Exceção ao obter carteiras:', error.message);
      return ApiResponse.error(res, 'Erro ao conectar com M-Pesa', 500);
    }
  });
}
