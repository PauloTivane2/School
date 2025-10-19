export interface CreateAttendanceDTO {
  aluno_id: string;
  turma_id: string;
  data: Date;
  presente: boolean;
  observacoes?: string;
}

export interface UpdateAttendanceDTO {
  presente?: boolean;
  observacoes?: string;
}

export interface AttendanceRecord {
  id: string;
  aluno_id: string;
  turma_id: string;
  data: Date;
  presente: boolean;
  observacoes?: string;
  aluno_nome?: string;
  turma_nome?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AttendanceSummary {
  aluno_id: string;
  aluno_nome: string;
  total_dias: number;
  presencas: number;
  faltas: number;
  taxa_presenca: number;
}

export interface AttendanceFilters {
  aluno_id?: string;
  turma_id?: string;
  data_inicio?: Date;
  data_fim?: Date;
}