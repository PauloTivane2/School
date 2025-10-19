// backend/routes/disciplinas.ts
import { Router } from 'express';
import { pool } from '../config/database';
const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_disciplinas, nome_disciplina FROM disciplinas ORDER BY nome_disciplina'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Erro ao buscar disciplinas:', err);
    res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
});

export default router;
