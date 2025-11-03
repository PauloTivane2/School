import api from './api';

export interface Student {
  id: string;
  name: string;
  dateOfBirth: string;
  identificationNumber: string;
  gender: string;
  classId: string;
  guardianId?: string;
  status: 'active' | 'inactive';
}

export interface CreateStudentDTO {
  name: string;
  dateOfBirth: string;
  identificationNumber: string;
  gender: string;
  classId: string;
  guardianId?: string;
}

export interface UpdateStudentDTO extends Partial<CreateStudentDTO> {}

class StudentService {
  async getAll(): Promise<Student[]> {
    const response = await api.get('/students');
    return response.data.data;
  }

  async getById(id: string): Promise<Student> {
    const response = await api.get(`/students/${id}`);
    return response.data.data;
  }

  async create(data: CreateStudentDTO): Promise<Student> {
    const response = await api.post('/students', data);
    return response.data.data;
  }

  async update(id: string, data: UpdateStudentDTO): Promise<Student> {
    const response = await api.put(`/students/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
  }

  async getByClass(classId: string): Promise<Student[]> {
    const response = await api.get(`/students?classId=${classId}`);
    return response.data.data;
  }
}

export default new StudentService();