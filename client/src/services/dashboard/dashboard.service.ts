/**
 * Dashboard Service
 * Serviço responsável por todas as chamadas de API do Dashboard
 */

import api from '../api';
import type {
  DashboardStats,
  RevenueData,
  AttendanceData,
  RecentPayment,
  RecentEvent,
  Notification
} from '../../types/dashboard.types';

class DashboardService {
  /**
   * Busca estatísticas gerais do dashboard
   */
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStats>('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.warn('API indisponível, usando dados mockados');
      return this.getMockStats();
    }
  }

  /**
   * Busca dados de receitas mensais
   */
  async getRevenueData(meses: number = 6): Promise<RevenueData[]> {
    try {
      const response = await api.get<RevenueData[]>(`/dashboard/revenue?meses=${meses}`);
      return response.data;
    } catch (error) {
      console.warn('API indisponível, usando dados mockados');
      return this.getMockRevenueData();
    }
  }

  /**
   * Busca dados de presença semanal
   */
  async getAttendanceData(turma?: string): Promise<AttendanceData[]> {
    try {
      const params = turma ? `?turma=${turma}` : '';
      const response = await api.get<AttendanceData[]>(`/dashboard/attendance${params}`);
      return response.data;
    } catch (error) {
      console.warn('API indisponível, usando dados mockados');
      return this.getMockAttendanceData();
    }
  }

  /**
   * Busca últimos pagamentos
   */
  async getRecentPayments(limit: number = 5): Promise<RecentPayment[]> {
    try {
      const response = await api.get<RecentPayment[]>(`/dashboard/payments/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.warn('API indisponível, usando dados mockados');
      return this.getMockRecentPayments();
    }
  }

  /**
   * Busca eventos recentes
   */
  async getRecentEvents(limit: number = 5): Promise<RecentEvent[]> {
    try {
      const response = await api.get<RecentEvent[]>(`/dashboard/events/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.warn('API indisponível, usando dados mockados');
      return this.getMockRecentEvents();
    }
  }

  /**
   * Busca notificações pendentes
   */
  async getNotifications(limit: number = 10): Promise<Notification[]> {
    try {
      const response = await api.get<Notification[]>(`/dashboard/notifications?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.warn('API indisponível, usando dados mockados');
      return this.getMockNotifications();
    }
  }

  // ==================== DADOS MOCKADOS ====================

  private getMockStats(): DashboardStats {
    return {
      receitaMesAtual: 1250000,
      receitaMesAnterior: 1180000,
      percentagemInadimplencia: 12.5,
      inadimplenciaAnterior: 15.2,
      faltasHoje: {
        total: 45,
        porTurma: [
          { turma: '10ª A', faltas: 8 },
          { turma: '10ª B', faltas: 12 },
          { turma: '11ª A', faltas: 15 },
          { turma: '12ª A', faltas: 10 }
        ]
      },
      candidatosExames: 234,
      candidatosAnterior: 220
    };
  }

  private getMockRevenueData(): RevenueData[] {
    const meses = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return meses.map((mes, index) => ({
      mes,
      receita: 1000000 + (index * 50000) + Math.random() * 200000,
      despesas: 600000 + (index * 30000) + Math.random() * 100000,
      liquido: 400000 + (index * 20000) + Math.random() * 100000
    }));
  }

  private getMockAttendanceData(): AttendanceData[] {
    const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    return dias.map(dia => ({
      dia,
      presentes: 180 + Math.floor(Math.random() * 40),
      ausentes: 10 + Math.floor(Math.random() * 20),
      turma: 'Geral'
    }));
  }

  private getMockRecentPayments(): RecentPayment[] {
    return [
      {
        id: 1,
        alunoNome: 'João Silva',
        valor: 5000,
        data: '2024-11-03',
        metodo: 'M-Pesa',
        estado: 'pago',
        tipo: 'Mensalidade'
      },
      {
        id: 2,
        alunoNome: 'Maria Santos',
        valor: 5000,
        data: '2024-11-03',
        metodo: 'Transferência',
        estado: 'pago',
        tipo: 'Mensalidade'
      },
      {
        id: 3,
        alunoNome: 'Pedro Costa',
        valor: 3500,
        data: '2024-11-02',
        metodo: 'Efectivo',
        estado: 'pago',
        tipo: 'Material'
      },
      {
        id: 4,
        alunoNome: 'Ana Ferreira',
        valor: 5000,
        data: '2024-11-02',
        metodo: 'Cartão',
        estado: 'pendente',
        tipo: 'Mensalidade'
      },
      {
        id: 5,
        alunoNome: 'Carlos Mendes',
        valor: 2500,
        data: '2024-11-01',
        metodo: 'M-Pesa',
        estado: 'pago',
        tipo: 'Exame'
      }
    ];
  }

  private getMockRecentEvents(): RecentEvent[] {
    return [
      {
        id: 1,
        titulo: 'Exames Finais - 12ª Classe',
        data: '2024-11-15',
        tipo: 'exame',
        descricao: 'Início dos exames finais'
      },
      {
        id: 2,
        titulo: 'Reunião de Pais e Encarregados',
        data: '2024-11-10',
        tipo: 'reuniao',
        descricao: 'Entrega de boletins do 3º trimestre'
      },
      {
        id: 3,
        titulo: 'Dia da Independência',
        data: '2024-11-25',
        tipo: 'feriado',
        descricao: 'Feriado nacional'
      },
      {
        id: 4,
        titulo: 'Feira de Ciências',
        data: '2024-11-20',
        tipo: 'evento',
        descricao: 'Apresentação de projetos científicos'
      },
      {
        id: 5,
        titulo: 'Formação de Professores',
        data: '2024-11-08',
        tipo: 'reuniao',
        descricao: 'Workshop de metodologias ativas'
      }
    ];
  }

  private getMockNotifications(): Notification[] {
    return [
      {
        id: 1,
        titulo: 'Pagamentos Pendentes',
        mensagem: '15 alunos com mensalidades atrasadas',
        tipo: 'warning',
        data: '2024-11-04',
        lida: false
      },
      {
        id: 2,
        titulo: 'Novo Aluno Matriculado',
        mensagem: 'José Manuel foi matriculado na 10ª A',
        tipo: 'success',
        data: '2024-11-04',
        lida: false
      },
      {
        id: 3,
        titulo: 'Faltas Excessivas',
        mensagem: '3 alunos ultrapassaram 25% de faltas',
        tipo: 'error',
        data: '2024-11-03',
        lida: false
      },
      {
        id: 4,
        titulo: 'Reunião Agendada',
        mensagem: 'Reunião de coordenação amanhã às 14h',
        tipo: 'info',
        data: '2024-11-03',
        lida: true
      }
    ];
  }
}

export default new DashboardService();
