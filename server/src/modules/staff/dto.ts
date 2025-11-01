export interface CreateStaffDTO {
  nome_funcionario: string;
  bi?: string;
  nuit?: string;
  nivel_academico?: string;
  funcao: 'Professor' | 'Diretor' | 'Secretaria' | 'Admin';
  email?: string;
  estado?: 'ativo' | 'inativo';
  senha_hash?: string;
}

export interface UpdateStaffDTO {
  nome_funcionario?: string;
  bi?: string;
  nuit?: string;
  nivel_academico?: string;
  funcao?: 'Professor' | 'Diretor' | 'Secretaria' | 'Admin';
  email?: string;
  estado?: 'ativo' | 'inativo';
  senha_hash?: string;
}

export function validateCreateStaffDTO(data: any): CreateStaffDTO {
  if (!data.nome_funcionario || typeof data.nome_funcionario !== 'string') {
    throw new Error('Nome do funcionário é obrigatório');
  }
  if (!data.funcao || !['Professor', 'Diretor', 'Secretaria', 'Admin'].includes(data.funcao)) {
    throw new Error('Função inválida');
  }
  return data as CreateStaffDTO;
}
