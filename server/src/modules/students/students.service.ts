import { StudentsRepository } from './students.repository';
import { CreateStudentDTO, UpdateStudentDTO, validateCreateStudentDTO, validateUpdateStudentDTO } from './dto';
import { AppError } from '../../middleware/error-handler.middleware';

/**
 * Service para lógica de negócio de estudantes
 */
export class StudentsService {
  private repository: StudentsRepository;

  constructor() {
    this.repository = new StudentsRepository();
  }

  /**
   * Listar todos os estudantes com filtros
   */
  async findAll(filters?: any) {
    try {
      return await this.repository.findAll(filters);
    } catch (error) {
      throw new AppError('Erro ao buscar estudantes', 500);
    }
  }

  /**
   * Buscar estudante por ID
   */
  async findById(id: number) {
    try {
      const student = await this.repository.findById(id);
      if (!student) {
        throw new AppError('Estudante não encontrado', 404);
      }
      return student;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar estudante', 500);
    }
  }

  /**
   * Criar novo estudante
   */
  async create(data: CreateStudentDTO) {
    // Validar dados
    const validation = validateCreateStudentDTO(data);
    if (!validation.valid) {
      throw new AppError('Dados inválidos', 400, true, validation.errors);
    }

    try {
      // Verificar se BI já existe
      if (data.bi) {
        const existingByBI = await this.repository.findByBI(data.bi);
        if (existingByBI) {
          throw new AppError('Já existe um estudante com este BI', 409);
        }
      }

      // Verificar se NUIT já existe
      if (data.nuit) {
        const existingByNUIT = await this.repository.findByNUIT(data.nuit);
        if (existingByNUIT) {
          throw new AppError('Já existe um estudante com este NUIT', 409);
        }
      }

      return await this.repository.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao criar estudante', 500);
    }
  }

  /**
   * Atualizar estudante
   */
  async update(id: number, data: UpdateStudentDTO) {
    // Validar dados
    const validation = validateUpdateStudentDTO(data);
    if (!validation.valid) {
      throw new AppError('Dados inválidos', 400, true, validation.errors);
    }

    try {
      // Verificar se estudante existe
      const student = await this.repository.findById(id);
      if (!student) {
        throw new AppError('Estudante não encontrado', 404);
      }

      // Verificar BI duplicado (se estiver sendo alterado)
      if (data.bi && data.bi !== student.bi) {
        const existingByBI = await this.repository.findByBI(data.bi);
        if (existingByBI) {
          throw new AppError('Já existe um estudante com este BI', 409);
        }
      }

      // Verificar NUIT duplicado (se estiver sendo alterado)
      if (data.nuit && data.nuit !== student.nuit) {
        const existingByNUIT = await this.repository.findByNUIT(data.nuit);
        if (existingByNUIT) {
          throw new AppError('Já existe um estudante com este NUIT', 409);
        }
      }

      return await this.repository.update(id, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar estudante', 500);
    }
  }

  /**
   * Deletar estudante
   */
  async delete(id: number) {
    try {
      const student = await this.repository.findById(id);
      if (!student) {
        throw new AppError('Estudante não encontrado', 404);
      }

      await this.repository.delete(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao deletar estudante', 500);
    }
  }

  /**
   * Contar estudantes
   */
  async count(filters?: any) {
    try {
      return await this.repository.count(filters);
    } catch (error) {
      throw new AppError('Erro ao contar estudantes', 500);
    }
  }

  /**
   * Buscar estudantes por turma
   */
  async findByTurma(turmaId: number) {
    try {
      return await this.repository.findByTurma(turmaId);
    } catch (error) {
      throw new AppError('Erro ao buscar estudantes da turma', 500);
    }
  }

  /**
   * Buscar classes para dropdown
   */
  async getClassesDropdown() {
    try {
      return await this.repository.getClassesDropdown();
    } catch (error) {
      throw new AppError('Erro ao buscar classes', 500);
    }
  }

  /**
   * Buscar turmas para dropdown
   */
  async getTurmasDropdown(ano?: number) {
    try {
      return await this.repository.getTurmasDropdown(ano);
    } catch (error) {
      throw new AppError('Erro ao buscar turmas', 500);
    }
  }

  /**
   * Buscar encarregados para dropdown
   */
  async getEncarregadosDropdown() {
    try {
      return await this.repository.getEncarregadosDropdown();
    } catch (error) {
      throw new AppError('Erro ao buscar encarregados', 500);
    }
  }
}
