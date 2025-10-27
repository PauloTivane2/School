/**
 * Entidade Staff - Representa funcionários/docentes no sistema
 * RF03: Criar/editar/eliminar funcionário/docente
 */
export interface Staff {
  id_funcionarios: number;
  nome_funcionario: string;
  bi?: string;
  nuit?: string;
  nivel_academico?: string;
  funcao: 'Professor' | 'Diretor' | 'Secretaria' | 'Admin';
  email?: string;
  estado: 'ativo' | 'inativo';
  senha_hash?: string;
  
  // Campos relacionados (joins)
  contacto1?: string;
  contacto2?: string;
  contacto3?: string;
  
  // Timestamps
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Interface para listagem de funcionários com dados relacionados
 */
export interface StaffWithRelations extends Staff {
  total_turmas?: number;
  turmas?: string[];
  total_disciplinas?: number;
  disciplinas?: string[];
}

/**
 * Interface para contatos do funcionário
 */
export interface StaffContact {
  id_contacto?: number;
  contacto1: string;
  contacto2?: string;
  contacto3?: string;
  id_funcionarios: number;
}

/**
 * Tipos de função permitidos
 */
export type StaffRole = 'Professor' | 'Diretor' | 'Secretaria' | 'Admin';

/**
 * Estados permitidos
 */
export type StaffStatus = 'ativo' | 'inativo';
