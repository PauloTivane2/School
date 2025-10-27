/**
 * DTOs para o módulo de Classes/Turmas
 * RF04: Criar/editar turmas, anos letivos, e horários
 */

// ===== Class DTOs =====
export interface CreateClassDTO {
  nome_classe: string;
}

export interface UpdateClassDTO {
  nome_classe?: string;
}

// ===== Turma DTOs =====
export interface CreateTurmaDTO {
  turma: string;
  id_classe?: number;
  ano: number;
  id_diretor_turma?: number;
}

export interface UpdateTurmaDTO {
  turma?: string;
  id_classe?: number;
  ano?: number;
  id_diretor_turma?: number;
}

export interface TurmaFilters {
  ano?: number;
  classe_id?: number;
}

// ===== Schedule/Horário DTOs =====
export interface CreateScheduleDTO {
  id_turma: number;
  id_disciplina: number;
  id_professor: number;
  dia_semana: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';
  hora_inicio: string;
  hora_fim: string;
  sala?: string;
}

export interface UpdateScheduleDTO {
  id_turma?: number;
  id_disciplina?: number;
  id_professor?: number;
  dia_semana?: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';
  hora_inicio?: string;
  hora_fim?: string;
  sala?: string;
}

export interface ScheduleFilters {
  turma_id?: number;
  disciplina_id?: number;
  professor_id?: number;
  dia_semana?: string;
}

// ===== SchoolYear DTOs =====
export interface CreateSchoolYearDTO {
  ano: number;
  data_inicio: Date | string;
  data_fim: Date | string;
  estado?: 'ativo' | 'inativo';
  descricao?: string;
}

export interface UpdateSchoolYearDTO {
  ano?: number;
  data_inicio?: Date | string;
  data_fim?: Date | string;
  estado?: 'ativo' | 'inativo';
  descricao?: string;
}

export interface SchoolYearFilters {
  ano?: number;
  estado?: 'ativo' | 'inativo';
}
