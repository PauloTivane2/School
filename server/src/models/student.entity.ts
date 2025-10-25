/**
 * Entidade Student - Representa um aluno no sistema
 * Unifica as entidades anteriores: alunos e estudantes
 */
export interface Student {
  id_aluno: number;
  nome_aluno: string;
  data_nascimento: Date;
  genero: 'M' | 'F';
  bi?: string;
  nuit?: string;
  id_classe?: number;
  id_turma?: number;
  id_encarregados?: number;
  estado: 'ativo' | 'inativo';
  
  // Campos relacionados (joins)
  turma_nome?: string;
  classe_nome?: string;
  encarregado_nome?: string;
  
  // Timestamps (se existirem na tabela)
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Interface para listagem de estudantes com dados relacionados
 */
export interface StudentWithRelations extends Student {
  turma_id?: number;
  turma?: string;
  id_classes?: number;
  nome_classe?: string;
  id_encarregados?: number;
  encarregado?: string;
}
