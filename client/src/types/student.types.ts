/**
 * Student Types
 * Tipos TypeScript para o módulo de Gestão de Alunos
 */

export interface Student {
  id: number;
  nomeCompleto: string;
  dataNascimento: string;
  nui: string;
  genero: 'M' | 'F';
  turma: string;
  turmaId: number;
  nivel: string;
  anoLetivo: string;
  estado: 'Ativo' | 'Inativo' | 'Transferido' | 'Graduado';
  encarregado: {
    id: number;
    nome: string;
    contacto: string;
    email?: string;
    parentesco: string;
  };
  morada?: string;
  contactoPessoal?: string;
  email?: string;
  dataMatricula: string;
  foto?: string;
}

export interface StudentFormData {
  nomeCompleto: string;
  dataNascimento: string;
  nui: string;
  genero: 'M' | 'F';
  turmaId: number;
  encarregadoId: number;
  morada?: string;
  contactoPessoal?: string;
  email?: string;
}

export interface StudentGrade {
  id: number;
  disciplina: string;
  trimestre: 1 | 2 | 3;
  nota: number;
  data: string;
  professor: string;
  observacao?: string;
}

export interface StudentAttendance {
  id: number;
  data: string;
  disciplina: string;
  status: 'Presente' | 'Ausente' | 'Justificado';
  observacao?: string;
}

export interface StudentPayment {
  id: number;
  tipo: string;
  valor: number;
  data: string;
  metodo: 'Efectivo' | 'Transferência' | 'M-Pesa' | 'Cartão';
  estado: 'pago' | 'pendente' | 'atrasado';
  referencia?: string;
}

export interface StudentFilters {
  search: string;
  turma: string;
  nivel: string;
  estado: string;
  anoLetivo: string;
}
