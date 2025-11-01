export interface CreateGradeDTO {
  aluno_id: number;
  avaliacao_id: number;
  valor: number;
  avaliador_id?: number;
  trimestre?: number;
}

export interface UpdateGradeDTO {
  aluno_id?: number;
  avaliacao_id?: number;
  valor?: number;
  avaliador_id?: number;
  trimestre?: number;
}

export interface CreateAvaliacaoDTO {
  classe_id: number;
  tipo: 'Prova' | 'TPC' | 'Exame' | 'Outro';
  data?: Date | string;
  peso?: number;
}

export function validateCreateGradeDTO(data: any): CreateGradeDTO {
  if (!data.aluno_id || typeof data.aluno_id !== 'number') {
    throw new Error('ID do aluno é obrigatório');
  }
  if (!data.avaliacao_id || typeof data.avaliacao_id !== 'number') {
    throw new Error('ID da avaliação é obrigatório');
  }
  if (data.valor === undefined || typeof data.valor !== 'number' || data.valor < 0 || data.valor > 20) {
    throw new Error('Valor deve ser um número entre 0 e 20');
  }
  return data as CreateGradeDTO;
}

export function validateCreateAvaliacaoDTO(data: any): CreateAvaliacaoDTO {
  if (!data.classe_id || typeof data.classe_id !== 'number') {
    throw new Error('ID da classe é obrigatório');
  }
  if (!data.tipo || !['Prova', 'TPC', 'Exame', 'Outro'].includes(data.tipo)) {
    throw new Error('Tipo de avaliação inválido');
  }
  return data as CreateAvaliacaoDTO;
}
