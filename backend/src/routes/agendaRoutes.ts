// backend/src/modules/agenda/agenda.routes.ts
import { Router, Request, Response } from 'express';
import { pool } from '../config/database'; // seu pool PostgreSQL já configurado

const router = Router();

// Obter todas agendas
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM agendas ORDER BY data_inicio ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar agendas' });
  }
});

// Criar nova agenda
router.post('/', async (req: Request, res: Response) => {
  const { tipo, data, hora_inicio, duracao, local, assunto, penalidades, ata, tolerancia, requisitos, conteudos } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO agendas 
      (tipo, data, hora_inicio, duracao, local, assunto, penalidades, ata, tolerancia, requisitos, conteudos)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [tipo, data, hora_inicio, duracao, local, assunto, penalidades, ata, tolerancia, requisitos, conteudos]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar agenda' });
  }
});

// Atualizar agenda
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tipo, data, hora_inicio, duracao, local, assunto, penalidades, ata, tolerancia, requisitos, conteudos } = req.body;

  try {
    const result = await pool.query(
      `UPDATE agendas SET tipo=$1, data=$2, hora_inicio=$3, duracao=$4, local=$5, assunto=$6, penalidades=$7, ata=$8, tolerancia=$9, requisitos=$10, conteudos=$11
      WHERE id=$12 RETURNING *`,
      [tipo, data, hora_inicio, duracao, local, assunto, penalidades, ata, tolerancia, requisitos, conteudos, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar agenda' });
  }
});

// Deletar agenda
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM agendas WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar agenda' });
  }
});

export default router;
