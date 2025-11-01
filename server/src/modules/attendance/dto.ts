export interface CreateAttendanceDTO {
  aluno_id: number;
  classe_id: number;
  data?: Date | string;
  presente?: boolean;
  observacao?: string;
}

export interface UpdateAttendanceDTO {
  aluno_id?: number;
  classe_id?: number;
  data?: Date | string;
  presente?: boolean;
  observacao?: string;
}

export function validateCreateAttendanceDTO(data: any): CreateAttendanceDTO {
  if (!data.aluno_id || typeof data.aluno_id !== 'number') {
    throw new Error('ID do aluno é obrigatório');
  }
  if (!data.classe_id || typeof data.classe_id !== 'number') {
    throw new Error('ID da classe é obrigatório');
  }
  return data as CreateAttendanceDTO;
}
