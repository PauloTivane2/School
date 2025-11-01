export interface CreateClassDTO {
  nome_classe: string;
}

export interface UpdateClassDTO {
  nome_classe?: string;
}

export interface CreateClassRelationDTO {
  id_classe: number;
  id_professor: number;
  id_disciplina: number;
}

export function validateCreateClassDTO(data: any): CreateClassDTO {
  if (!data.nome_classe || typeof data.nome_classe !== 'string') {
    throw new Error('Nome da classe é obrigatório');
  }
  return data as CreateClassDTO;
}

export function validateCreateClassRelationDTO(data: any): CreateClassRelationDTO {
  if (!data.id_classe || typeof data.id_classe !== 'number') {
    throw new Error('ID da classe é obrigatório');
  }
  if (!data.id_professor || typeof data.id_professor !== 'number') {
    throw new Error('ID do professor é obrigatório');
  }
  if (!data.id_disciplina || typeof data.id_disciplina !== 'number') {
    throw new Error('ID da disciplina é obrigatório');
  }
  return data as CreateClassRelationDTO;
}
