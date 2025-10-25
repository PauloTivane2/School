import { ClassesRepository } from './classes.repository';
import { CreateClassDTO, CreateTurmaDTO, UpdateClassDTO, UpdateTurmaDTO } from './dto';
import { AppError } from '../../middleware/error-handler.middleware';

export class ClassesService {
  private repository: ClassesRepository;

  constructor() {
    this.repository = new ClassesRepository();
  }

  // ===== CLASSES =====
  async findAllClasses() {
    return await this.repository.findAllClasses();
  }

  async findClassById(id: number) {
    const classe = await this.repository.findClassById(id);
    if (!classe) throw new AppError('Classe não encontrada', 404);
    return classe;
  }

  async createClass(data: CreateClassDTO) {
    return await this.repository.createClass(data);
  }

  async updateClass(id: number, data: UpdateClassDTO) {
    await this.findClassById(id);
    return await this.repository.updateClass(id, data);
  }

  async deleteClass(id: number) {
    await this.findClassById(id);
    await this.repository.deleteClass(id);
  }

  // ===== TURMAS =====
  async findAllTurmas(filters?: any) {
    return await this.repository.findAllTurmas(filters);
  }

  async findTurmaById(id: number) {
    const turma = await this.repository.findTurmaById(id);
    if (!turma) throw new AppError('Turma não encontrada', 404);
    return turma;
  }

  async createTurma(data: CreateTurmaDTO) {
    return await this.repository.createTurma(data);
  }

  async updateTurma(id: number, data: UpdateTurmaDTO) {
    await this.findTurmaById(id);
    return await this.repository.updateTurma(id, data);
  }

  async deleteTurma(id: number) {
    await this.findTurmaById(id);
    await this.repository.deleteTurma(id);
  }
}
