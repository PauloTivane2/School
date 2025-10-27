import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export type StaffRole = 'Professor' | 'Diretor' | 'Secretaria' | 'Admin';
export type StaffStatus = 'ativo' | 'inativo';

export interface Staff {
  id_funcionarios: number;
  nome_funcionario: string;
  bi?: string;
  nuit?: string;
  nivel_academico?: string;
  funcao: StaffRole;
  email?: string;
  estado: StaffStatus;
  contacto1?: string;
  contacto2?: string;
  contacto3?: string;
}

export interface CreateStaffDTO {
  nome_funcionario: string;
  bi?: string;
  nuit?: string;
  nivel_academico?: string;
  funcao: StaffRole;
  email?: string;
  estado?: StaffStatus;
  senha?: string;
  contacto1: string;
  contacto2?: string;
  contacto3?: string;
}

export interface UpdateStaffDTO {
  nome_funcionario?: string;
  bi?: string;
  nuit?: string;
  nivel_academico?: string;
  funcao?: StaffRole;
  email?: string;
  estado?: StaffStatus;
  senha?: string;
  contacto1?: string;
  contacto2?: string;
  contacto3?: string;
}

class StaffService {
  /**
   * Buscar todos os funcionários
   */
  async getAll(filters?: { q?: string; funcao?: StaffRole; estado?: StaffStatus }): Promise<Staff[]> {
    const response = await axios.get(`${API_URL}/staff`, { params: filters });
    return response.data.data;
  }

  /**
   * Buscar funcionário por ID
   */
  async getById(id: number): Promise<Staff> {
    const response = await axios.get(`${API_URL}/staff/${id}`);
    return response.data.data;
  }

  /**
   * Criar novo funcionário
   */
  async create(data: CreateStaffDTO): Promise<Staff> {
    const response = await axios.post(`${API_URL}/staff`, data);
    return response.data.data;
  }

  /**
   * Atualizar funcionário
   */
  async update(id: number, data: UpdateStaffDTO): Promise<Staff> {
    const response = await axios.put(`${API_URL}/staff/${id}`, data);
    return response.data.data;
  }

  /**
   * Deletar funcionário
   */
  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}/staff/${id}`);
  }

  /**
   * Contar funcionários
   */
  async count(filters?: { funcao?: StaffRole; estado?: StaffStatus; q?: string }): Promise<number> {
    const response = await axios.get(`${API_URL}/staff/count`, { params: filters });
    return response.data.data.total;
  }

  /**
   * Autenticar funcionário
   */
  async authenticate(email: string, senha: string): Promise<Staff> {
    const response = await axios.post(`${API_URL}/staff/authenticate`, { email, senha });
    return response.data.data;
  }
}

export default new StaffService();
