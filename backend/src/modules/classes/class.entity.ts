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
