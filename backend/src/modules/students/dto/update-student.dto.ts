/**
 * DTO para atualização de estudante
 * Todos os campos são opcionais
 */
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

/**
 * Validação do DTO de atualização
 */
export const validateUpdateStudentDTO = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (data.nome_aluno !== undefined && (typeof data.nome_aluno !== 'string' || data.nome_aluno.trim().length === 0)) {
    errors.push('Nome do aluno deve ser uma string válida');
  }

  if (data.genero !== undefined && !['M', 'F'].includes(data.genero)) {
    errors.push('Gênero deve ser M ou F');
  }

  if (data.estado !== undefined && !['ativo', 'inativo'].includes(data.estado)) {
    errors.push('Estado deve ser ativo ou inativo');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
