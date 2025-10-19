// src/modules/grades/dto/grade.dto.ts
export interface Grade {
  id: number;
  aluno_id: number;
  disciplina_id: number;
  trimestre: string;
  valor: number;
  peso: number;
}

export interface CreateGradeDTO {
  aluno_id: number;
  disciplina_id: number;
  nota: number;
  periodo: string;
  data_avaliacao: Date;
}