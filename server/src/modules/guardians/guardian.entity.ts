/**
 * Entidade Guardian - Representa um encarregado/responsável no sistema
 * RF02: Criar/editar/eliminar encarregado
 */
export interface Guardian {
  id_encarregados: number;
  nome: string;
  email?: string;
  morada?: string;
  
  // Campos relacionados (joins)
  contacto1?: string;
  contacto2?: string;
  contacto3?: string;
  
  // Timestamps
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Interface para listagem de encarregados com dados relacionados
 */
export interface GuardianWithRelations extends Guardian {
  total_alunos?: number;
  alunos?: string[];
}

/**
 * Interface para contatos do encarregado
 */
export interface GuardianContact {
  id_contacto?: number;
  contacto1: string;
  contacto2?: string;
  contacto3?: string;
  id_encarregados: number;
}
