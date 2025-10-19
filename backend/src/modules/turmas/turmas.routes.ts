import { Router } from 'express';
import { pool } from '@config/database';

const router = Router();

// 🔹 Buscar todas as classes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        t.id AS turma_id,
        t.nome AS turma_nome,
        t.ano_letivo,
        t.nivel AS turma_nivel,
        d.nome AS disciplina,
        f.nome AS professor
      FROM classes c
      JOIN turmas t ON c.turma_id = t.id
      JOIN disciplinas d ON c.disciplina_id = d.id
      LEFT JOIN funcionarios f ON c.professor_id = f.id
      ORDER BY t.nome, d.nome;
    `);

    const formatted = result.rows.map(row => ({
      id: row.id,
      turma: {
        id: row.turma_id,
        nome: row.turma_nome,
        ano_letivo: row.ano_letivo,
        nivel: row.turma_nivel
      },
      disciplina: row.disciplina || 'Sem disciplina',
      professor: row.professor || 'Sem professor'
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Erro ao buscar classes:', err);
    res.status(500).json({ error: 'Erro ao buscar classes' });
  }
});

// 🔹 Criar nova classe
router.post('/', async (req, res) => {
  const { turma_id, disciplina_id, professor_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO classes (turma_id, disciplina_id, professor_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [turma_id, disciplina_id, professor_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar classe:', err);
    res.status(500).json({ error: 'Erro ao criar classe' });
  }
});

// 🔹 Atualizar classe
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { turma_id, disciplina_id, professor_id } = req.body;

  try {
    await pool.query(
      `UPDATE classes
       SET turma_id=$1, disciplina_id=$2, professor_id=$3
       WHERE id=$4`,
      [turma_id, disciplina_id, professor_id || null, id]
    );
    res.json({ message: 'Classe atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar classe:', err);
    res.status(500).json({ error: 'Erro ao atualizar classe' });
  }
});

// 🔹 Deletar classe
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM classes WHERE id=$1', [id]);
    res.json({ message: 'Classe eliminada com sucesso' });
  } catch (err) {
    console.error('Erro ao eliminar classe:', err);
    res.status(500).json({ error: 'Erro ao eliminar classe' });
  }
});

export default router;

