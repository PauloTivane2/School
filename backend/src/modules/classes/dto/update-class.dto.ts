export interface UpdateClassDTO {
  nome_classe?: string;
}

export interface UpdateTurmaDTO {
  turma?: string;
  id_classe?: number;
  ano?: number;
  id_diretor_turma?: number;
}
