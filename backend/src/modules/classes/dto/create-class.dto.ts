export interface CreateClassDTO {
  nome_classe: string;
}

export interface CreateTurmaDTO {
  turma: string;
  id_classe?: number;
  ano: number;
  id_diretor_turma?: number;
}

export const validateCreateClassDTO = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.nome_classe || typeof data.nome_classe !== 'string' || data.nome_classe.trim().length === 0) {
    errors.push('Nome da classe é obrigatório');
  }

  return { valid: errors.length === 0, errors };
};

export const validateCreateTurmaDTO = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.turma || typeof data.turma !== 'string' || data.turma.trim().length === 0) {
    errors.push('Nome da turma é obrigatório');
  }

  if (!data.ano || typeof data.ano !== 'number' || data.ano < 2000) {
    errors.push('Ano é obrigatório e deve ser válido');
  }

  return { valid: errors.length === 0, errors };
};
