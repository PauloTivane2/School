import { StudentsRepository } from './estudantes.repository';
import { CreateStudentDTO, UpdateStudentDTO } from './dto';

export class StudentsService {
  private studentsRepository: StudentsRepository;

  constructor() {
    this.studentsRepository = new StudentsRepository();
  }

  async findAll(filters: any) {
    return await this.studentsRepository.findAll(filters);
  }

  async findById(id: string) {
    return await this.studentsRepository.findById(id);
  }

  async create(data: CreateStudentDTO) {
    // Validar se o número de identificação já existe
    const existingStudent = await this.studentsRepository.findByIdentificationNumber(
      data.identificationNumber
    );

    if (existingStudent) {
      throw new Error('Número de identificação já existe');
    }

    return await this.studentsRepository.create(data);
  }

  async update(id: string, data: UpdateStudentDTO) {
    const student = await this.studentsRepository.findById(id);
    
    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    // Se estiver atualizando o número de identificação, verificar se já existe
    if (data.identificationNumber && data.identificationNumber !== student.identification_number) {
      const existingStudent = await this.studentsRepository.findByIdentificationNumber(
        data.identificationNumber
      );

      if (existingStudent) {
        throw new Error('Número de identificação já existe');
      }
    }

    return await this.studentsRepository.update(id, data);
  }

  async delete(id: string) {
    const student = await this.studentsRepository.findById(id);
    
    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    return await this.studentsRepository.delete(id);
  }
}