// backend/routes/funcionarios.ts
import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// ===========================================================
// GET /api/funcionarios
// Buscar todos os funcionários com filtros opcionais: q (pesquisa), funcao
// ===========================================================
router.get('/', async (req, res) => {
  const { q, funcao } = req.query;

  try {
    const params: any[] = [];
    let query = `
      SELECT 
        f.id_funcionarios,
        f.nome_funcionario,
        f.funcao,
        f.email,
        f.estado,
        c.contacto1,
        c.contacto2,
        c.contacto3
      FROM funcionarios f
      LEFT JOIN contactos c ON f.id_funcionarios = c.id_funcionarios
      WHERE 1=1
    `;

    if (funcao) {
      params.push(funcao);
      query += ` AND f.funcao = $${params.length}`;
    }

    if (q) {
      params.push(`%${q}%`);
      query += ` AND (
        f.nome_funcionario ILIKE $${params.length} OR
        f.email ILIKE $${params.length} OR
        c.contacto1 ILIKE $${params.length} OR
        c.contacto2 ILIKE $${params.length} OR
        c.contacto3 ILIKE $${params.length}
      )`;
    }

    query += ` ORDER BY f.nome_funcionario`;

    const result = await pool.query(query, params);

    // Garantir que contatos NULL virem string vazia
    const formatted = result.rows.map(f => ({
      id_funcionarios: f.id_funcionarios,
      nome_funcionario: f.nome_funcionario,
      funcao: f.funcao,
      email: f.email ?? '',
      estado: f.estado,
      contacto1: f.contacto1 ?? '',
      contacto2: f.contacto2 ?? '',
      contacto3: f.contacto3 ?? '',
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ Erro ao buscar funcionários:', err);
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

// ===========================================================
// GET /api/funcionarios/:id
// Buscar um funcionário específico
// ===========================================================
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        f.id_funcionarios,
        f.nome_funcionario,
        f.funcao,
        f.email,
        f.estado,
        c.contacto1,
        c.contacto2,
        c.contacto3
      FROM funcionarios f
      LEFT JOIN contactos c ON f.id_funcionarios = c.id_funcionarios
      WHERE f.id_funcionarios = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    const f = result.rows[0];

    res.json({
      id_funcionarios: f.id_funcionarios,
      nome_funcionario: f.nome_funcionario,
      funcao: f.funcao,
      email: f.email ?? '',
      estado: f.estado,
      contacto1: f.contacto1 ?? '',
      contacto2: f.contacto2 ?? '',
      contacto3: f.contacto3 ?? '',
    });
  } catch (err) {
    console.error('❌ Erro ao buscar funcionário:', err);
    res.status(500).json({ error: 'Erro ao buscar funcionário' });
  }
});

export default router;
