export interface CreateAttendanceDTO {
  aluno_id: number;
  turma_id?: number;
  classe_id?: number;
  data: Date;
  presente: boolean;
  observacao?: string;
}

export interface BatchAttendanceDTO {
  attendances: CreateAttendanceDTO[];
}
