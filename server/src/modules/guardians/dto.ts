export interface CreateGuardianDTO {
  nome: string;
  email?: string;
  morada?: string;
}

export interface UpdateGuardianDTO {
  nome?: string;
  email?: string;
  morada?: string;
}

export function validateCreateGuardianDTO(data: any): CreateGuardianDTO {
  if (!data.nome || typeof data.nome !== 'string') {
    throw new Error('Nome do encarregado é obrigatório');
  }
  return data as CreateGuardianDTO;
}
