export interface CreateGuardianDTO {
  nome: string;
  email?: string;
  morada?: string;
  contacto1?: string;
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

export function validateCreateGuardianDTO(data: any): CreateGuardianDTO {
  if (!data.nome || typeof data.nome !== 'string') {
    throw new Error('Nome do encarregado é obrigatório');
  }
  return data as CreateGuardianDTO;
}
