// backend/src/controllers/turmas.controller.ts
import { Request, Response } from 'express';
import { pool } from '../../config/database';

export const getTurmas = async (req: Request, res: Response) => {
  const { ano = '' } = req.query as Record<string, string>;
  try {
    const params: any[] = [];
    let sql = `SELECT id_turma, turma, ano, id_classe FROM turmas`;
    if (ano) {
      sql += ` WHERE ano = $1 ORDER BY turma`;
      params.push(Number(ano));
    } else {
      sql += ` ORDER BY ano DESC, turma`;
    }
    const { rows } = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error('getTurmas error', err);
    return res.status(500).json({ error: 'Erro ao buscar turmas' });
  }
};

