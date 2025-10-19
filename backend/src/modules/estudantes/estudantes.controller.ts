// backend/src/controllers/students.controller.ts
import { Request, Response } from 'express';
import { pool } from '../../config/database';
 

// GET /api/students?q=&ano=&turma_id=
export const getStudents = async (req: Request, res: Response) => {
  const { q = '', ano = '', turma_id = '' } = req.query as Record<string, string>;
  try {
    // Busca alunos juntando turmas, classes, encarregados
    // Pesquisa em nome do aluno e nome do encarregado (ILIKE)
    // Filtra por ano (turmas.ano) e turma_id se fornecido
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (q) {
      conditions.push(`(al.nome_aluno ILIKE '%' || $${idx} || '%' OR encar.nome ILIKE '%' || $${idx} || '%')`);
      params.push(q);
      idx++;
    }
    if (ano) {
      conditions.push(`tur.ano = $${idx}`);
      params.push(Number(ano));
      idx++;
    }
    if (turma_id) {
      conditions.push(`tur.id_turma = $${idx}`);
      params.push(Number(turma_id));
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        al.*,
        tur.id_turma,
        tur.turma AS turma_nome,
        cls.id_classes AS id_classe,
        cls.nome_classe AS classe_nome,
        encar.id_encarregados,
        encar.nome AS encarregado_nome
      FROM alunos al
      LEFT JOIN turmas tur ON al.id_turma = tur.id_turma
      LEFT JOIN classes cls ON al.id_classe = cls.id_classes
      LEFT JOIN encarregados encar ON al.id_encarregados = encar.id_encarregados
      ${where}
      ORDER BY al.nome_aluno
      LIMIT 1000;
    `;

    const { rows } = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error('getStudents error', err);
    return res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
};

// GET /api/students/:id
export const getStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const sql = `
      SELECT 
        al.*,
        tur.id_turma,
        tur.turma AS turma_nome,
        cls.id_classes AS id_classe,
        cls.nome_classe AS classe_nome,
        encar.id_encarregados,
        encar.nome AS encarregado_nome
      FROM alunos al
      LEFT JOIN turmas tur ON al.id_turma = tur.id_turma
      LEFT JOIN classes cls ON al.id_classe = cls.id_classes
      LEFT JOIN encarregados encar ON al.id_encarregados = encar.id_encarregados
      WHERE al.id_aluno = $1
      LIMIT 1;
    `;
    const { rows } = await pool.query(sql, [Number(id)]);
    if (rows.length === 0) return res.status(404).json({ error: 'Aluno não encontrado' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('getStudentById error', err);
    return res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
};

// DELETE /api/students/:id
export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM alunos WHERE id_aluno = $1', [Number(id)]);
    return res.json({ ok: true });
  } catch (err) {
    console.error('deleteStudent error', err);
    return res.status(500).json({ error: 'Erro ao eliminar aluno' });
  }
};
