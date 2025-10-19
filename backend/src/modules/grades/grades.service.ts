import { GradesRepository, CreateGradeDTO, Grade } from './grades.repository';
import { pool } from '@config/database';

export class GradesService {
  private repository: GradesRepository;

  constructor() {
    this.repository = new GradesRepository();
  }

  async create(data: CreateGradeDTO): Promise<Grade> {
    const existing = await this.repository.findByStudentDisciplineTrimestre(
      data.aluno_id.toString(),
      data.disciplina_id.toString(),
      data.trimestre
    );

    if (existing) {
      throw new Error('Nota já registrada para este aluno, disciplina e trimestre');
    }

    return await this.repository.create(data);
  }

  async update(id: string, valor: string): Promise<Grade | null> {
    return await this.repository.update(id, valor);
  }

  async findByStudent(studentId: number, trimestre: string): Promise<Grade[]> {
    return await this.repository.findByStudent(studentId.toString(), trimestre);
  }

  async getBoletim(studentId: number, trimestre: number) {
    const result = await pool.query(`
      SELECT 
        d.nome as disciplina,
        n.valor as nota,
        n.trimestre
      FROM notas n
      JOIN disciplinas d ON n.avaliacao_id = d.id
      WHERE n.aluno_id = $1 AND n.trimestre = $2
      ORDER BY d.nome
    `, [studentId, trimestre]);

    const notas = result.rows;
    const media = notas.length > 0
      ? notas.reduce((sum, n) => sum + parseFloat(n.nota), 0) / notas.length
      : 0;

    return {
      aluno_id: studentId,
      trimestre,
      notas,
      media: media.toFixed(1),
      status: media >= 10 ? 'Aprovado' : 'Reprovado'
    };
  }

  async getStudentsByTurma(turmaId: number) {
    const result = await pool.query(`
      SELECT id, nome FROM alunos WHERE turma_id = $1 ORDER BY nome
    `, [turmaId]);
    return result.rows;
  }

  async getDisciplinas() {
    const result = await pool.query('SELECT id, nome FROM disciplinas ORDER BY nome');
    return result.rows;
  }
}