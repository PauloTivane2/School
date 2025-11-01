import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { ApiResponse } from '../../common/utils/response.util';
import { asyncHandler } from '../../core/middleware/error-handler.middleware';

export class PaymentsController {
  private service: PaymentsService;

  constructor() {
    this.service = new PaymentsService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { aluno_id, estado, data_inicio, data_fim } = req.query;

    const filters = {
      aluno_id: aluno_id ? Number(aluno_id) : undefined,
      estado: estado as string,
      data_inicio: data_inicio ? new Date(data_inicio as string) : undefined,
      data_fim: data_fim ? new Date(data_fim as string) : undefined,
    };

    const payments = await this.service.findAll(filters);
    return ApiResponse.success(res, payments, 'Pagamentos listados com sucesso');
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const payment = await this.service.findById(Number(req.params.id));
    return ApiResponse.success(res, payment);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const payment = await this.service.create(req.body);
    return ApiResponse.created(res, payment, 'Pagamento registrado com sucesso');
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const payment = await this.service.update(Number(req.params.id), req.body);
    return ApiResponse.success(res, payment, 'Pagamento atualizado com sucesso');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(Number(req.params.id));
    return ApiResponse.success(res, { ok: true }, 'Pagamento deletado com sucesso');
  });

  getTotalByStudent = asyncHandler(async (req: Request, res: Response) => {
    const total = await this.service.getTotalByStudent(Number(req.params.alunoId));
    return ApiResponse.success(res, { total });
  });

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const { data_inicio, data_fim } = req.query;

    const filters = {
      data_inicio: data_inicio ? new Date(data_inicio as string) : undefined,
      data_fim: data_fim ? new Date(data_fim as string) : undefined,
    };

    const stats = await this.service.getPaymentStats(filters);
    return ApiResponse.success(res, stats, 'Estatísticas geradas com sucesso');
  });

  /**
   * GET /api/payments/recibo/:id
   * Gerar recibo de pagamento
   */
  generateReceipt = asyncHandler(async (req: Request, res: Response) => {
    const receipt = await this.service.generateReceipt(Number(req.params.id));
    return ApiResponse.success(res, receipt, 'Recibo gerado com sucesso');
  });

  /**
   * GET /api/payments/historico/:alunoId
   * Histórico completo de pagamentos do aluno
   */
  getPaymentHistory = asyncHandler(async (req: Request, res: Response) => {
    const history = await this.service.getPaymentHistory(Number(req.params.alunoId));
    return ApiResponse.success(res, history, 'Histórico obtido com sucesso');
  });

  /**
   * POST /api/payments/desconto
   * Aplicar desconto ou bolsa
   */
  applyDiscount = asyncHandler(async (req: Request, res: Response) => {
    const { aluno_id, tipo, valor, motivo } = req.body;
    const result = await this.service.applyDiscount(aluno_id, tipo, valor, motivo);
    return ApiResponse.success(res, result, 'Desconto aplicado com sucesso');
  });

  /**
   * GET /api/payments/pendentes
   * Listar pagamentos pendentes
   */
  getPending = asyncHandler(async (req: Request, res: Response) => {
    const { turma_id, mes } = req.query;
    const pending = await this.service.getPendingPayments(
      turma_id ? Number(turma_id) : undefined,
      mes ? Number(mes) : undefined
    );
    return ApiResponse.success(res, pending, 'Pagamentos pendentes listados');
  });
}
