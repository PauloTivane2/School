import { Response, NextFunction, RequestHandler } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from './auth.middleware';

/**
 * RN04: Professores só acessam suas turmas/alunos
 * - Admin: sempre permitido
 * - Professor: permitido se o recurso pertence a uma turma onde é diretor/professor
 */
export const teacherScope = {
  // Valida acesso por id da turma
  byTurma: (): RequestHandler => async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = req.user?.role;
      const userId = req.user?.userId;
      if (!role || !userId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }
      if (role === 'Admin') return next();
      if (role !== 'Professor') {
        res.status(403).json({ message: 'Acesso negado' });
        return;
      }

      const turmaId = Number(req.params.turmaId || req.query.turmaId || req.body?.id_turma);
      if (!turmaId || isNaN(turmaId)) {
        res.status(400).json({ message: 'turmaId inválido ou ausente' });
        return;
      }

      // Regra simples: professor é diretor da turma
      const q = `SELECT 1 FROM turmas WHERE id_turma = $1 AND id_diretor_turma = $2`;
      const r = await pool.query(q, [turmaId, userId]);
      if (r.rowCount === 0) {
        res.status(403).json({ message: 'Acesso negado à turma' });
        return;
      }

      next();
    } catch (e) {
      res.status(500).json({ message: 'Erro ao validar escopo do professor' });
    }
  },

  // Valida acesso por id do aluno
  byStudent: (): RequestHandler => async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = req.user?.role;
      const userId = req.user?.userId;
      if (!role || !userId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }
      if (role === 'Admin') return next();
      if (role !== 'Professor') {
        res.status(403).json({ message: 'Acesso negado' });
        return;
      }

      const studentId = Number(req.params.alunoId || req.params.studentId || req.body?.id_aluno);
      if (!studentId || isNaN(studentId)) {
        res.status(400).json({ message: 'studentId inválido ou ausente' });
        return;
      }

      const q = `
        SELECT 1
        FROM alunos a
        JOIN turmas t ON t.id_turma = a.id_turma
        WHERE a.id_aluno = $1 AND t.id_diretor_turma = $2
      `;
      const r = await pool.query(q, [studentId, userId]);
      if (r.rowCount === 0) {
        res.status(403).json({ message: 'Acesso negado ao aluno' });
        return;
      }

      next();
    } catch (e) {
      res.status(500).json({ message: 'Erro ao validar escopo do professor' });
    }
  },
};
