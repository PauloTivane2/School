/**
 * DTO para criação de um novo estudante
 */
export interface CreateStudentDTO {
  nome_aluno: string;
  data_nascimento: Date | string;
  genero: 'M' | 'F';
  bi?: string;
  nuit?: string;
  id_classe?: number;
  id_turma?: number;
  id_encarregados?: number;
  estado?: 'ativo' | 'inativo';
}

/**
 * Validação do DTO (regras de negócio)
 */
export const validateCreateStudentDTO = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.nome_aluno || typeof data.nome_aluno !== 'string' || data.nome_aluno.trim().length === 0) {
    errors.push('Nome do aluno é obrigatório');
  }

  if (!data.data_nascimento) {
    errors.push('Data de nascimento é obrigatória');
  }

  if (!data.genero || !['M', 'F'].includes(data.genero)) {
    errors.push('Gênero deve ser M ou F');
  }

  if (data.estado && !['ativo', 'inativo'].includes(data.estado)) {
    errors.push('Estado deve ser ativo ou inativo');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
