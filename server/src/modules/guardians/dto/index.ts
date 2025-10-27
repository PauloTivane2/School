/**
 * DTOs para o módulo de Encarregados
 * RF02: Validação de dados de encarregados
 */

export interface CreateGuardianDTO {
  nome: string;
  email?: string;
  morada?: string;
  contacto1: string;
  contacto2?: string;
  contacto3?: string;
}

export interface UpdateGuardianDTO {
  nome?: string;
  email?: string;
  morada?: string;
  contacto1?: string;
  contacto2?: string;
  contacto3?: string;
}

export interface GuardianFilters {
  q?: string;          // Pesquisa por nome, email ou contacto
  email?: string;
}
