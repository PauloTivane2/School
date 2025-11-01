export interface CreateStudentDTO {
  nome_aluno: string;
  data_nascimento: Date | string;
  genero?: 'M' | 'F';
  bi?: string;
  nuit?: string;
  id_classe?: number;
  id_turma?: number;
  id_encarregados?: number;
  estado?: 'ativo' | 'inativo';
}

export interface UpdateStudentDTO {
  nome_aluno?: string;
  data_nascimento?: Date | string;
  genero?: 'M' | 'F';
  bi?: string;
  nuit?: string;
  id_classe?: number;
  id_turma?: number;
  id_encarregados?: number;
  estado?: 'ativo' | 'inativo';
}

export function validateCreateStudentDTO(data: any): CreateStudentDTO {
  if (!data.nome_aluno || typeof data.nome_aluno !== 'string') {
    throw new Error('Nome do aluno é obrigatório');
  }
  if (!data.data_nascimento) {
    throw new Error('Data de nascimento é obrigatória');
  }
  return data as CreateStudentDTO;
}
