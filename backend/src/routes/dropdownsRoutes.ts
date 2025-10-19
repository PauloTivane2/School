import { Router, Request, Response } from 'express';
import { pool } from '../config/database';

const router = Router();

// ✅ Listar classes
router.get('/classes', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, nome FROM classes ORDER BY nome ASC;');
    res.json(result.rows);
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    res.status(500).json({ error: message });
  }
});

// ✅ Listar turmas
router.get('/turmas', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, nome FROM turmas ORDER BY nome ASC;');
    res.json(result.rows);
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    res.status(500).json({ error: message });
  }
});

// ✅ Listar encarregados
router.get('/encarregados', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, nome FROM encarregados ORDER BY nome ASC;');
    res.json(result.rows);
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    res.status(500).json({ error: message });
  }
});

export default router;
