import { GradesRepository } from './grades.repository';
import { CreateGradeDTO, UpdateGradeDTO } from './dto';
import { AppError } from '../../middleware/error-handler.middleware';

export class GradesService {
  private repository: GradesRepository;

  constructor() {
    this.repository = new GradesRepository();
  }

  async findAll(filters?: any) {
    return await this.repository.findAll(filters);
  }

  async findByStudent(studentId: number, trimestre: string) {
    return await this.repository.findByStudent(studentId, trimestre);
  }

  async create(data: CreateGradeDTO) {
    return await this.repository.create(data);
  }

  async update(id: number, data: UpdateGradeDTO) {
    return await this.repository.update(id, data);
  }

  async getBoletim(alunoId: number, trimestre: number) {
    return await this.repository.getBoletim(alunoId, trimestre);
  }

  async getStudentsByTurma(turmaId: number) {
    return await this.repository.getStudentsByTurma(turmaId);
  }

  async getDisciplinas() {
    return await this.repository.getDisciplinas();
  }
}