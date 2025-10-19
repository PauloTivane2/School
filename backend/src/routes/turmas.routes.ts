// backend/src/routes/turmas.routes.ts
import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET /api/turmas?ano=2025
router.get('/', async (req, res) => {
  const ano = req.query.ano;
  if (!ano) return res.status(400).json({ error: 'Ano não informado' });

  try {
    const result = await pool.query(`
      SELECT 
        t.id_turma,
        t.turma AS turma_nome,
        c.nome_classe AS classe_nome,
        CONCAT(c.nome_classe, ' / ', t.turma) AS classe_turma
      FROM turmas t
      LEFT JOIN classes c ON t.id_classe = c.id_classes
      WHERE t.ano = $1
      ORDER BY c.nome_classe, t.turma
    `, [ano]);

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar turmas:', err);
    res.status(500).json({ error: 'Erro ao buscar turmas' });
  }
});

export default router;
