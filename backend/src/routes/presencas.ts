import { Router } from 'express';
import { query } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT pr.*, a.nome AS aluno_nome, t.nome AS turma_nome
      FROM presencas pr
      LEFT JOIN alunos a ON pr.aluno_id = a.id
      LEFT JOIN turmas t ON a.turma_id = t.id
      ORDER BY pr.data DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar presenças' });
  }
});

export default router;
