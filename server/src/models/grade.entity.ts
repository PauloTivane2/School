export interface Grade {
  id: number;
  aluno_id: number;
  disciplina_id: number;
  avaliacao_id?: number;
  valor: number;
  trimestre: number;
  periodo?: string;
  avaliador_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface GradeWithDetails extends Grade {
  aluno_nome?: string;
  disciplina_nome?: string;
  avaliador_nome?: string;
}

export interface Boletim {
  aluno_id: number;
  aluno_nome: string;
  trimestre: number;
  disciplinas: {
    disciplina_id: number;
    disciplina_nome: string;
    nota: number;
  }[];
  media_geral: number;
}
