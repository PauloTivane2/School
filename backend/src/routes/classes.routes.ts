import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET /api/classes/funcionarios?funcao=Professor
router.get('/funcionarios', async (req, res) => {
  try {
    const funcao = req.query.funcao || null;
    const result = funcao
      ? await pool.query(
          'SELECT id_funcionarios, nome_funcionario FROM funcionarios WHERE funcao = $1',
          [funcao]
        )
      : await pool.query('SELECT id_funcionarios, nome_funcionario FROM funcionarios');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar funcionários:', err);
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

// GET /api/classes/disciplinas
router.get('/disciplinas', async (_req, res) => {
  try {
    const result = await pool.query('SELECT id_disciplinas, nome_disciplina FROM disciplinas');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar disciplinas:', err);
    res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
});

export default router;
