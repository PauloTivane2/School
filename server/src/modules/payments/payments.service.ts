import { PaymentsRepository } from './payments.repository';
import { CreatePaymentDTO, UpdatePaymentDTO, validateCreatePaymentDTO } from './dto';
import { AppError } from '../../middleware/error-handler.middleware';

export class PaymentsService {
  private repository: PaymentsRepository;

  constructor() {
    this.repository = new PaymentsRepository();
  }

  async findAll(filters?: any) {
    return await this.repository.findAll(filters);
  }

  async findById(id: number) {
    const payment = await this.repository.findById(id);
    if (!payment) throw new AppError('Pagamento não encontrado', 404);
    return payment;
  }

  async create(data: CreatePaymentDTO) {
    const validation = validateCreatePaymentDTO(data);
    if (!validation.valid) {
      throw new AppError('Dados inválidos', 400, true, validation.errors);
    }

    // Verificar referência duplicada
    const existingPayment = await this.repository.findByReferencia(data.referencia);
    if (existingPayment) {
      throw new AppError('Referência de pagamento já existe', 409);
    }

    return await this.repository.create(data);
  }

  async update(id: number, data: UpdatePaymentDTO) {
    await this.findById(id);

    if (data.referencia) {
      const existing = await this.repository.findByReferencia(data.referencia);
      if (existing && existing.id !== id) {
        throw new AppError('Referência já existe', 409);
      }
    }

    return await this.repository.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id);
    await this.repository.delete(id);
  }

  async getTotalByStudent(alunoId: number) {
    return await this.repository.getTotalByStudent(alunoId);
  }

  async getPaymentStats(filters?: any) {
    return await this.repository.getPaymentStats(filters);
  }
}
