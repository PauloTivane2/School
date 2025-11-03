import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Guardian {
  id_encarregados: number;
  nome: string;
  email?: string;
  morada?: string;
  contacto1?: string;
  contacto2?: string;
  contacto3?: string;
  total_alunos?: number;
}

export interface CreateGuardianDTO {
  nome: string;
  email?: string;
  morada?: string;
  contacto1: string;
  contacto2?: string;
  contacto3?: string;
}

export interface UpdateGuardianDTO {
  nome?: string;
  email?: string;
  morada?: string;
  contacto1?: string;
  contacto2?: string;
  contacto3?: string;
}

class GuardiansService {
  /**
   * Buscar todos os encarregados
   */
  async getAll(filters?: { q?: string; email?: string }): Promise<Guardian[]> {
    const response = await axios.get(`${API_URL}/guardians`, { params: filters });
    return response.data.data;
  }

  /**
   * Buscar encarregado por ID
   */
  async getById(id: number): Promise<Guardian> {
    const response = await axios.get(`${API_URL}/guardians/${id}`);
    return response.data.data;
  }

  /**
   * Criar novo encarregado
   */
  async create(data: CreateGuardianDTO): Promise<Guardian> {
    const response = await axios.post(`${API_URL}/guardians`, data);
    return response.data.data;
  }

  /**
   * Atualizar encarregado
   */
  async update(id: number, data: UpdateGuardianDTO): Promise<Guardian> {
    const response = await axios.put(`${API_URL}/guardians/${id}`, data);
    return response.data.data;
  }

  /**
   * Deletar encarregado
   */
  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}/guardians/${id}`);
  }

  /**
   * Contar encarregados
   */
  async count(filters?: { q?: string }): Promise<number> {
    const response = await axios.get(`${API_URL}/guardians/count`, { params: filters });
    return response.data.data.total;
  }
}

export default new GuardiansService();
