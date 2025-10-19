import { PaymentsRepository } from './pagamentos.repository';

interface CreatePaymentDTO {
  aluno_id: number;
  valor: number;
  metodo: string;
  referencia: string;
  estado: string;
}

export class PaymentsService {
  private repository: PaymentsRepository;

  constructor() {
    this.repository = new PaymentsRepository();
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async create(data: CreatePaymentDTO) {
    return await this.repository.create(data);
  }

  async update(id: string, data: Partial<CreatePaymentDTO>) {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }
    return await this.repository.update(id, data);
  }

  async delete(id: string) {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }
    return await this.repository.delete(id);
  }
}