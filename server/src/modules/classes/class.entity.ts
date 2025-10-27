/**
 * Entidade Class - Representa uma classe escolar
 */
export interface Class {
  id_classes: number;
  nome_classe: string;
}

/**
 * Entidade Turma - Representa uma turma (classe em um ano específico)
 */
export interface Turma {
  id_turma: number;
  turma: string;
  id_classe?: number;
  ano: number;
  id_diretor_turma?: number;
  
  // Relacionamentos
  nome_classe?: string;
  diretor_nome?: string;
}

/**
 * Interface para turma com informações completas
 */
export interface TurmaWithDetails extends Turma {
  total_alunos?: number;
}

/**
 * Entidade Schedule/Horário - Representa um horário de aula
 * RF04: Criar/editar turmas, anos letivos, e horários
 */
export interface Schedule {
  id_horario?: number;
  id_turma: number;
  id_disciplina: number;
  id_professor: number;
  dia_semana: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';
  hora_inicio: string;
  hora_fim: string;
  sala?: string;
  
  // Relacionamentos
  turma_nome?: string;
  disciplina_nome?: string;
  professor_nome?: string;
}

/**
 * Entidade SchoolYear - Representa um ano letivo
 * RF04: Criar/editar turmas, anos letivos, e horários
 */
export interface SchoolYear {
  id_ano_letivo?: number;
  ano: number;
  data_inicio: Date;
  data_fim: Date;
  estado: 'ativo' | 'inativo';
  descricao?: string;
}
