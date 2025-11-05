/**
 * Dashboard Types
 * Tipos TypeScript para o módulo de Dashboard
 */

export interface DashboardStats {
  receitaMesAtual: number;
  receitaMesAnterior: number;
  percentagemInadimplencia: number;
  inadimplenciaAnterior: number;
  faltasHoje: {
    total: number;
    porTurma: Array<{
      turma: string;
      faltas: number;
    }>;
  };
  candidatosExames: number;
  candidatosAnterior: number;
}

export interface RevenueData {
  mes: string;
  receita: number;
  despesas: number;
  liquido: number;
}

export interface AttendanceData {
  dia: string;
  presentes: number;
  ausentes: number;
  turma: string;
}

export interface RecentPayment {
  id: number;
  alunoNome: string;
  valor: number;
  data: string;
  metodo: 'Efectivo' | 'Transferência' | 'M-Pesa' | 'Cartão';
  estado: 'pago' | 'pendente' | 'atrasado';
  tipo: string;
}

export interface RecentEvent {
  id: number;
  titulo: string;
  data: string;
  tipo: 'exame' | 'reuniao' | 'evento' | 'feriado';
  descricao?: string;
}

export interface Notification {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  data: string;
  lida: boolean;
}
