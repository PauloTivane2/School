import { AttendanceRepository } from './attendance.repository';
import { CreateAttendanceDTO, BatchAttendanceDTO } from './dto';
import { AppError } from '../../middleware/error-handler.middleware';

export class AttendanceService {
  private repository: AttendanceRepository;

  constructor() {
    this.repository = new AttendanceRepository();
  }

  async findAll(filters?: any) {
    return await this.repository.findAll(filters);
  }

  async findByTurmaAndDate(turmaId: number, date: Date) {
    return await this.repository.findByTurmaAndDate(turmaId, date);
  }

  async findByStudent(alunoId: number, startDate?: Date, endDate?: Date) {
    return await this.repository.findByStudent(alunoId, startDate, endDate);
  }

  async create(data: CreateAttendanceDTO) {
    return await this.repository.create(data);
  }

  async batchCreate(data: BatchAttendanceDTO) {
    if (!data.attendances || data.attendances.length === 0) {
      throw new AppError('Nenhuma presença para registrar', 400);
    }

    return await this.repository.batchCreate(data.attendances);
  }

  async getAttendanceReport(turmaId: number, startDate: Date, endDate: Date) {
    return await this.repository.getAttendanceReport(turmaId, startDate, endDate);
  }

  async getStudentAttendanceStats(alunoId: number, startDate?: Date, endDate?: Date) {
    return await this.repository.getStudentAttendanceStats(alunoId, startDate, endDate);
  }
}
