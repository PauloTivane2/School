export interface Attendance {
  id: number;
  aluno_id: number;
  turma_id?: number;
  classe_id?: number;
  data: Date;
  presente: boolean;
  observacao?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AttendanceWithDetails extends Attendance {
  aluno_nome?: string;
  turma_nome?: string;
}
