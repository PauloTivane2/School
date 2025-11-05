import { Response, NextFunction, RequestHandler } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from './auth.middleware';

/**
 * RN01/RN04: Encarregados só acessam seus educandos
 * - Admin: sempre permitido
 * - Encarregado: permitido se o aluno é seu educando
 */
export const guardianScope = {
  // Valida acesso por id do aluno
  byStudent: (): RequestHandler => async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = req.user?.role;
      const userId = req.user?.userId;
      
      if (!role || !userId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }

      // Admin sempre tem acesso
      if (role === 'Admin') return next();

      // Apenas encarregados podem usar este middleware
      if (role !== 'Encarregado') {
        res.status(403).json({ message: 'Acesso negado' });
        return;
      }

      const studentId = Number(req.params.alunoId || req.params.studentId || req.body?.id_aluno);
      if (!studentId || isNaN(studentId)) {
        res.status(400).json({ message: 'studentId inválido ou ausente' });
        return;
      }

      // Verificar se o aluno pertence ao encarregado
      const query = `
        SELECT 1 
        FROM alunos 
        WHERE id_aluno = $1 AND id_encarregado = $2
      `;
      const result = await pool.query(query, [studentId, userId]);

      if (result.rowCount === 0) {
        res.status(403).json({ message: 'Acesso negado ao aluno' });
        return;
      }

      next();
    } catch (error) {
      console.error('Erro ao validar escopo do encarregado:', error);
      res.status(500).json({ message: 'Erro ao validar escopo do encarregado' });
    }
  },

  // Valida se encarregado pode acessar dados financeiros do aluno
  byPayment: (): RequestHandler => async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = req.user?.role;
      const userId = req.user?.userId;

      if (!role || !userId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }

      if (role === 'Admin' || role === 'Tesouraria') return next();

      if (role !== 'Encarregado') {
        res.status(403).json({ message: 'Acesso negado' });
        return;
      }

      const alunoId = Number(req.params.alunoId || req.query.alunoId || req.body?.id_aluno);
      if (!alunoId || isNaN(alunoId)) {
        res.status(400).json({ message: 'alunoId inválido ou ausente' });
        return;
      }

      // Verificar se o aluno pertence ao encarregado
      const query = `
        SELECT 1 
        FROM alunos 
        WHERE id_aluno = $1 AND id_encarregado = $2
      `;
      const result = await pool.query(query, [alunoId, userId]);

      if (result.rowCount === 0) {
        res.status(403).json({ message: 'Acesso negado aos dados financeiros' });
        return;
      }

      next();
    } catch (error) {
      console.error('Erro ao validar escopo financeiro:', error);
      res.status(500).json({ message: 'Erro ao validar escopo financeiro' });
    }
  },

  // Lista apenas alunos do encarregado
  filterStudents: (): RequestHandler => async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = req.user?.role;
      const userId = req.user?.userId;

      if (!role || !userId) {
        res.status(401).json({ message: 'Não autenticado' });
        return;
      }

      // Admin e Tesouraria veem todos
      if (role === 'Admin' || role === 'Tesouraria') return next();

      // Encarregado: adicionar filtro na query
      if (role === 'Encarregado') {
        req.query.id_encarregado = String(userId);
      }

      next();
    } catch (error) {
      console.error('Erro ao filtrar alunos:', error);
      res.status(500).json({ message: 'Erro ao filtrar alunos' });
    }
  },
};
