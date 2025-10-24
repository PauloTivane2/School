export interface CreateGradeDTO {
  aluno_id: number;
  disciplina_id: number;
  valor: string | number;
  trimestre: number;
  periodo?: string;
  avaliador_id?: number;
}
