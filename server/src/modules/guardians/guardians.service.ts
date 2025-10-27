import { GuardiansRepository } from './guardians.repository';
import { Guardian, GuardianWithRelations } from './guardian.entity';
import { CreateGuardianDTO, UpdateGuardianDTO, GuardianFilters } from './dto';

/**
 * Service para lógica de negócio relacionada a Encarregados
 * RF02: Criar/editar/eliminar encarregado
 */
export class GuardiansService {
  private repository: GuardiansRepository;

  constructor() {
    this.repository = new GuardiansRepository();
  }

  /**
   * Listar todos os encarregados com filtros
   */
  async findAll(filters: GuardianFilters): Promise<GuardianWithRelations[]> {
    return await this.repository.findAll(filters);
  }

  /**
   * Buscar encarregado por ID
   */
  async findById(id: number): Promise<Guardian> {
    const guardian = await this.repository.findById(id);

    if (!guardian) {
      throw new Error(`Encarregado com ID ${id} não encontrado`);
    }

    return guardian;
  }

  /**
   * Criar novo encarregado
   */
  async create(data: CreateGuardianDTO): Promise<Guardian> {
    // Validações
    if (!data.nome || data.nome.trim() === '') {
      throw new Error('Nome do encarregado é obrigatório');
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
      const existingGuardians = await this.repository.findAll({ email: data.email });
      if (existingGuardians.length > 0) {
        throw new Error('Email já cadastrado para outro encarregado');
      }
    }

    return await this.repository.create(data);
  }

  /**
   * Atualizar encarregado existente
   */
  async update(id: number, data: UpdateGuardianDTO): Promise<Guardian> {
    // Verificar se encarregado existe
    await this.findById(id);

    // Validações
    if (data.nome !== undefined && data.nome.trim() === '') {
      throw new Error('Nome do encarregado não pode ser vazio');
    }

    // Validar email se fornecido
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Email inválido');
    }

    // Verificar se email já existe (exceto para o próprio encarregado)
    if (data.email) {
      const existingGuardians = await this.repository.findAll({ email: data.email });
      const duplicate = existingGuardians.find(g => g.id_encarregados !== id);
      if (duplicate) {
        throw new Error('Email já cadastrado para outro encarregado');
      }
    }

    const updated = await this.repository.update(id, data);

    if (!updated) {
      throw new Error(`Erro ao atualizar encarregado ${id}`);
    }

    return updated;
  }

  /**
   * Deletar encarregado
   */
  async delete(id: number): Promise<void> {
    // Verificar se encarregado existe
    await this.findById(id);

    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new Error(`Erro ao deletar encarregado ${id}`);
    }
  }

  /**
   * Contar encarregados
   */
  async count(filters: GuardianFilters = {}): Promise<number> {
    return await this.repository.count(filters);
  }

  /**
   * Validar formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
