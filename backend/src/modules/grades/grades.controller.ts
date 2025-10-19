import { Request, Response } from 'express';
import { GradesService } from './grades.service';

export class GradesController {
  private service: GradesService;

  constructor() {
    this.service = new GradesService();
  }

  // ==========================================================
  // POST /api/grades → Lançar nova nota
  // ==========================================================
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { aluno_id, disciplina_id, valor, trimestre, periodo } = req.body;

      if (!aluno_id || !disciplina_id || !valor || !trimestre) {
        res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        return;
      }

      const nota = await this.service.create({
        aluno_id: Number(aluno_id),
        disciplina_id: Number(disciplina_id),
        valor: valor.toString(),
        trimestre: Number(trimestre),
        periodo: periodo || `${trimestre}º Trimestre`
      });

      res.status(201).json(nota);
    } catch (error: any) {
      console.error('Erro ao criar nota:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  // ==========================================================
  // PUT /api/grades/:id → Atualizar nota existente
  // ==========================================================
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { valor } = req.body;

      if (!valor) {
        res.status(400).json({ error: 'O campo valor é obrigatório.' });
        return;
      }

      const nota = await this.service.update(id, valor);

      if (!nota) {
        res.status(404).json({ error: 'Nota não encontrada.' });
        return;
      }

      res.status(200).json(nota);
    } catch (error: any) {
      console.error('Erro ao atualizar nota:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  // ==========================================================
  // GET /api/grades/student?aluno_id=1&trimestre=2
  // ==========================================================
  async findByStudent(req: Request, res: Response): Promise<void> {
    try {
      const { aluno_id, trimestre } = req.query;

      if (!aluno_id || !trimestre) {
        res.status(400).json({ error: 'Parâmetros aluno_id e trimestre são obrigatórios.' });
        return;
      }

      const notas = await this.service.findByStudent(Number(aluno_id), trimestre.toString());
      res.status(200).json(notas);
    } catch (error: any) {
      console.error('Erro ao buscar notas do aluno:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  // ==========================================================
  // GET /api/grades/boletim?aluno_id=1&trimestre=2
  // ==========================================================
  async getBoletim(req: Request, res: Response): Promise<void> {
    try {
      const { aluno_id, trimestre } = req.query;

      if (!aluno_id || !trimestre) {
        res.status(400).json({ error: 'Parâmetros aluno_id e trimestre são obrigatórios.' });
        return;
      }

      const boletim = await this.service.getBoletim(Number(aluno_id), Number(trimestre));
      res.status(200).json(boletim);
    } catch (error: any) {
      console.error('Erro ao gerar boletim:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  // ==========================================================
  // GET /api/grades/students/:turmaId → alunos da turma
  // ==========================================================
  async getStudentsByTurma(req: Request, res: Response): Promise<void> {
    try {
      const { turmaId } = req.params;

      if (!turmaId) {
        res.status(400).json({ error: 'O parâmetro turmaId é obrigatório.' });
        return;
      }

      const alunos = await this.service.getStudentsByTurma(Number(turmaId));
      res.status(200).json(alunos);
    } catch (error: any) {
      console.error('Erro ao buscar alunos da turma:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  // ==========================================================
  // GET /api/grades/disciplinas → todas as disciplinas
  // ==========================================================
  async getDisciplinas(_req: Request, res: Response): Promise<void> {
    try {
      const disciplinas = await this.service.getDisciplinas();
      res.status(200).json(disciplinas);
    } catch (error: any) {
      console.error('Erro ao buscar disciplinas:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
