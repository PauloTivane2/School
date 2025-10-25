/**
 * DTOs para o módulo de estudantes
 */

export interface CreateStudentDTO {
  nome_aluno: string;
  data_nascimento: string;
  genero: string;
  bi?: string;
  nuit?: string;
  id_classe: number;
  id_turma: number;
  id_encarregados?: number;
}

export interface UpdateStudentDTO {
  nome_aluno?: string;
  data_nascimento?: string;
  genero?: string;
  bi?: string;
  nuit?: string;
  id_classe?: number;
  id_turma?: number;
  id_encarregados?: number;
  estado?: string;
}

/**
 * Validação de CreateStudentDTO
 */
export function validateCreateStudentDTO(data: CreateStudentDTO): { valid: boolean; errors?: any } {
  const errors: any = {};

  if (!data.nome_aluno || data.nome_aluno.trim() === '') {
    errors.nome_aluno = 'Nome do aluno é obrigatório';
  }

  if (!data.data_nascimento) {
    errors.data_nascimento = 'Data de nascimento é obrigatória';
  }

  if (!data.genero) {
    errors.genero = 'Gênero é obrigatório';
  }

  if (!data.id_classe) {
    errors.id_classe = 'Classe é obrigatória';
  }

  if (!data.id_turma) {
    errors.id_turma = 'Turma é obrigatória';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

/**
 * Validação de UpdateStudentDTO
 */
export function validateUpdateStudentDTO(data: UpdateStudentDTO): { valid: boolean; errors?: any } {
  // Para update, todos os campos são opcionais
  return { valid: true };
}
