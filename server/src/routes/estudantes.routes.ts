// File: backend/src/routes/estudantes.routes.ts
import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// ===========================================================
// 🔹 Dropdown combinado Classe / Turma (sem duplicatas reais)
// ===========================================================
router.get('/dropdowns/turmas', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        MIN(t.id_turma) AS id_turma,           -- garante 1 id_turma por grupo
        c.id_classes,
        c.nome_classe,
        t.turma,
        CONCAT(c.nome_classe, ' / ', t.turma) AS classe_turma
      FROM turmas t
      INNER JOIN classes c ON c.id_classes = t.id_classe
      GROUP BY c.id_classes, c.nome_classe, t.turma
      ORDER BY c.nome_classe, t.turma
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Erro ao buscar turmas:', err);
    res.status(500).json({ error: 'Erro ao buscar turmas' });
  }
});


// ===========================================================
// 🔹 Dropdown combinado Classe / Turma (sem duplicatas reais)
// ===========================================================
router.get('/dropdowns/turmas', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT 
        t.id_turma,
        t.turma,
        c.id_classes,
        c.nome_classe,
        CONCAT(c.nome_classe, ' / ', t.turma) AS classe_turma
      FROM turmas t
      INNER JOIN classes c ON c.id_classes = t.id_classe
      ORDER BY c.nome_classe, t.turma
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar classes/turmas:', err);
    res.status(500).json({ error: 'Erro ao buscar classes/turmas' });
  }
});

router.get('/dropdowns/encarregados', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT id_encarregados, nome FROM encarregados ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar encarregados:', err);
    res.status(500).json({ error: 'Erro ao buscar encarregados' });
  }
});

// ===========================================================
// 🔹 Listar alunos com filtros opcionais: q, ano, turma_id (DISTINCT para evitar duplicatas)
// ===========================================================
router.get('/', async (req, res) => {
  const { q, ano, turma_id } = req.query;

  try {
    let baseQuery = `
      SELECT DISTINCT ON (a.id_aluno)
        a.id_aluno AS usuario,
        a.nome_aluno AS nome,
        a.genero,
        a.bi AS numero_identificacao,
        a.data_nascimento,
        a.estado AS status,
        -- 🔹 Encarregado
        e.nome AS encarregado_nome,
        -- 🔹 Classe e Turma
        c.id_classes AS classe_id,
        c.nome_classe AS classe_nome,
        t.id_turma AS turma_id,
        t.turma AS turma_nome,
        CONCAT(c.nome_classe, ' / ', t.turma) AS classe_turma,
        -- 🔹 Usuário (professor/diretor associado à classe)
        COALESCE(f.nome_funcionario, 'Sem atribuição') AS funcionario,
        -- 🔹 Último pagamento
        COALESCE(p.valor::TEXT || ' MZN (' || p.estado || ')', 'Sem registro') AS pagamento
      FROM alunos a
      LEFT JOIN encarregados e ON a.id_encarregados = e.id_encarregados
      LEFT JOIN turmas t ON a.id_turma = t.id_turma
      LEFT JOIN classes c ON a.id_classe = c.id_classes
      LEFT JOIN classes_relacoes cr ON cr.id_classe = c.id_classes
      LEFT JOIN funcionarios f ON cr.id_professor = f.id_funcionarios
      LEFT JOIN LATERAL (
        SELECT valor, estado
        FROM pagamentos
        WHERE aluno_id = a.id_aluno
        ORDER BY data_pagamento DESC
        LIMIT 1
      ) p ON TRUE
      WHERE 1=1
    `;

    const params: any[] = [];

    if (ano) {
      baseQuery += ` AND t.ano = $${params.length + 1}`;
      params.push(ano);
    }

    if (turma_id) {
      baseQuery += ` AND t.id_turma = $${params.length + 1}`;
      params.push(turma_id);
    }

    if (q) {
      baseQuery += ` AND (a.nome_aluno ILIKE $${params.length + 1}
                      OR e.nome ILIKE $${params.length + 1}
                      OR f.nome_funcionario ILIKE $${params.length + 1})`;
      params.push(`%${q}%`);
    }

    baseQuery += ` ORDER BY a.id_aluno, c.nome_classe, t.turma, a.nome_aluno`;

    const result = await pool.query(baseQuery, params);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Erro ao buscar alunos:', err);
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

// ===========================================================
// 🔹 Buscar aluno individual
// ===========================================================
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM alunos WHERE id_aluno=$1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Aluno não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar aluno:', err);
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
});

// ===========================================================
// 🔹 Criar aluno
// ===========================================================
router.post('/', async (req, res) => {
  const { nome_aluno, data_nascimento, genero, bi, nuit, id_classe, id_turma, id_encarregados } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO alunos (nome_aluno, data_nascimento, genero, bi, nuit, id_classe, id_turma, id_encarregados, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'ativo') RETURNING *`,
      [nome_aluno, data_nascimento, genero, bi, nuit, id_classe, id_turma, id_encarregados]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar aluno:', err);
    res.status(500).json({ error: 'Erro ao criar aluno' });
  }
});

// ===========================================================
// 🔹 Atualizar aluno
// ===========================================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome_aluno, data_nascimento, genero, bi, nuit, id_classe, id_turma, id_encarregados } = req.body;
  try {
    const result = await pool.query(
      `UPDATE alunos SET nome_aluno=$1, data_nascimento=$2, genero=$3, bi=$4, nuit=$5, id_classe=$6, id_turma=$7, id_encarregados=$8
       WHERE id_aluno=$9 RETURNING *`,
      [nome_aluno, data_nascimento, genero, bi, nuit, id_classe, id_turma, id_encarregados, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar aluno:', err);
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
});

export default router;


