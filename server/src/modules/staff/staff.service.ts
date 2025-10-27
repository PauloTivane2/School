import { StaffRepository } from './staff.repository';
import { Staff, StaffWithRelations } from './staff.entity';
import { CreateStaffDTO, UpdateStaffDTO, StaffFilters } from './dto';

/**
 * Service para lógica de negócio relacionada a Funcionários
 * RF03: Criar/editar/eliminar funcionário/docente
 */
export class StaffService {
  private repository: StaffRepository;

  constructor() {
    this.repository = new StaffRepository();
  }

  /**
   * Listar todos os funcionários com filtros
   */
  async findAll(filters: StaffFilters): Promise<StaffWithRelations[]> {
    return await this.repository.findAll(filters);
  }

  /**
   * Buscar funcionário por ID
   */
  async findById(id: number): Promise<Staff> {
    const staff = await this.repository.findById(id);

    if (!staff) {
      throw new Error(`Funcionário com ID ${id} não encontrado`);
    }

    return staff;
  }

  /**
   * Criar novo funcionário
   */
  async create(data: CreateStaffDTO): Promise<Staff> {
    // Validações
    if (!data.nome_funcionario || data.nome_funcionario.trim() === '') {
      throw new Error('Nome do funcionário é obrigatório');
    }

    if (!data.funcao) {
      throw new Error('Função é obrigatória');
    }

    // Validar função
    const funcoesPermitidas = ['Professor', 'Diretor', 'Secretaria', 'Admin'];
    if (!funcoesPermitidas.includes(data.funcao)) {
      throw new Error('Função inválida. Use: Professor, Diretor, Secretaria ou Admin');
    }

    if (!data.contacto1 || data.contacto1.trim() === '') {
      throw new Error('Pelo menos um contacto é obrigatório');
    }

    // Validar email se fornecido
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Email inválido');
    }

    // Verificar se email já existe
    if (data.email) {
      const existingStaff = await this.repository.findAll({ email: data.email });
      if (existingStaff.length > 0) {
        throw new Error('Email já cadastrado para outro funcionário');
      }
    }

    // Verificar se BI já existe
    if (data.bi) {
      const existingByBI = await this.repository.findAll({ q: data.bi });
      const duplicateBI = existingByBI.find(s => s.bi === data.bi);
      if (duplicateBI) {
        throw new Error('BI já cadastrado para outro funcionário');
      }
    }

    // Verificar se NUIT já existe
    if (data.nuit) {
      const existingByNUIT = await this.repository.findAll({ q: data.nuit });
      const duplicateNUIT = existingByNUIT.find(s => s.nuit === data.nuit);
      if (duplicateNUIT) {
        throw new Error('NUIT já cadastrado para outro funcionário');
      }
    }

    return await this.repository.create(data);
  }

  /**
   * Atualizar funcionário existente
   */
  async update(id: number, data: UpdateStaffDTO): Promise<Staff> {
    // Verificar se funcionário existe
    await this.findById(id);

    // Validações
    if (data.nome_funcionario !== undefined && data.nome_funcionario.trim() === '') {
      throw new Error('Nome do funcionário não pode ser vazio');
    }

    // Validar função se fornecida
    if (data.funcao) {
      const funcoesPermitidas = ['Professor', 'Diretor', 'Secretaria', 'Admin'];
      if (!funcoesPermitidas.includes(data.funcao)) {
        throw new Error('Função inválida. Use: Professor, Diretor, Secretaria ou Admin');
      }
    }

    // Validar email se fornecido
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Email inválido');
    }

    // Verificar se email já existe (exceto para o próprio funcionário)
    if (data.email) {
      const existingStaff = await this.repository.findAll({ email: data.email });
      const duplicate = existingStaff.find(s => s.id_funcionarios !== id);
      if (duplicate) {
        throw new Error('Email já cadastrado para outro funcionário');
      }
    }

    // Verificar se BI já existe (exceto para o próprio funcionário)
    if (data.bi) {
      const existingByBI = await this.repository.findAll({ q: data.bi });
      const duplicateBI = existingByBI.find(s => s.bi === data.bi && s.id_funcionarios !== id);
      if (duplicateBI) {
        throw new Error('BI já cadastrado para outro funcionário');
      }
    }

    // Verificar se NUIT já existe (exceto para o próprio funcionário)
    if (data.nuit) {
      const existingByNUIT = await this.repository.findAll({ q: data.nuit });
      const duplicateNUIT = existingByNUIT.find(s => s.nuit === data.nuit && s.id_funcionarios !== id);
      if (duplicateNUIT) {
        throw new Error('NUIT já cadastrado para outro funcionário');
      }
    }

    const updated = await this.repository.update(id, data);

    if (!updated) {
      throw new Error(`Erro ao atualizar funcionário ${id}`);
    }

    return updated;
  }

  /**
   * Deletar funcionário
   */
  async delete(id: number): Promise<void> {
    // Verificar se funcionário existe
    await this.findById(id);

    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new Error(`Erro ao deletar funcionário ${id}`);
    }
  }

  /**
   * Contar funcionários
   */
  async count(filters: StaffFilters = {}): Promise<number> {
    return await this.repository.count(filters);
  }

  /**
   * Autenticar funcionário
   */
  async authenticate(email: string, senha: string): Promise<Staff> {
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios');
    }

    const staff = await this.repository.validateCredentials(email, senha);

    if (!staff) {
      throw new Error('Credenciais inválidas');
    }

    return staff;
  }

  /**
   * Validar formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
