import api from './api';

export interface GuardianStudent {
  id_aluno: number;
  nome: string;
  data_nascimento: string;
  genero: string;
  estado: string;
  nome_turma?: string;
  classe?: string;
}

export interface GuardianDashboard {
  students: GuardianStudent[];
  stats: {
    total_alunos: number;
    pagamentos_pendentes: number;
    media_geral: number;
    total_faltas: number;
  };
  alerts: Array<{
    tipo: string;
    aluno_nome: string;
    mensagem: string;
    data: string;
  }>;
}

export interface StudentGrade {
  id_nota: number;
  nota: number;
  trimestre: number;
  data_lancamento: string;
  observacoes?: string;
  nome_disciplina: string;
  codigo_disciplina: string;
  professor_nome?: string;
}

export interface StudentAttendance {
  id_presenca: number;
  data: string;
  estado: string;
  justificacao?: string;
  nome_disciplina?: string;
  nome_turma?: string;
}

export interface StudentPayment {
  id_pagamento: number;
  valor: number;
  data_pagamento?: string;
  data_vencimento: string;
  estado: string;
  metodo_pagamento?: string;
  referencia?: string;
  descricao?: string;
  nome_tipo_pagamento?: string;
}

export interface StudentExam {
  id_exame: number;
  nome_exame: string;
  data_exame: string;
  hora_inicio: string;
  hora_fim: string;
  local?: string;
  estado: string;
  nome_disciplina?: string;
  nota?: number;
  estado_inscricao: string;
}

class GuardianService {
  /**
   * Obter todos os alunos do encarregado logado
   */
  async getMyStudents(): Promise<GuardianStudent[]> {
    try {
      const response = await api.get('/guardians/meus-alunos');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      throw error;
    }
  }

  /**
   * Obter dashboard do encarregado
   */
  async getDashboard(): Promise<GuardianDashboard> {
    try {
      const response = await api.get('/guardians/dashboard');
      return response.data.data || { students: [], stats: {}, alerts: [] };
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
      throw error;
    }
  }

  /**
   * Obter notas de um aluno específico
   */
  async getStudentGrades(studentId: number): Promise<StudentGrade[]> {
    try {
      const response = await api.get(`/guardians/aluno/${studentId}/notas`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      throw error;
    }
  }

  /**
   * Obter presenças de um aluno específico
   */
  async getStudentAttendance(studentId: number): Promise<StudentAttendance[]> {
    try {
      const response = await api.get(`/guardians/aluno/${studentId}/presencas`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar presenças:', error);
      throw error;
    }
  }

  /**
   * Obter pagamentos de um aluno específico
   */
  async getStudentPayments(studentId: number): Promise<StudentPayment[]> {
    try {
      const response = await api.get(`/guardians/aluno/${studentId}/pagamentos`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      throw error;
    }
  }

  /**
   * Obter exames de um aluno específico
   */
  async getStudentExams(studentId: number): Promise<StudentExam[]> {
    try {
      const response = await api.get(`/guardians/aluno/${studentId}/exames`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
      throw error;
    }
  }
}

export default new GuardianService();
