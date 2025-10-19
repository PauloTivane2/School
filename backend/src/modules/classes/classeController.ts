import { Request, Response } from 'express';
import { pool } from '../../config/database';

// ✅ Buscar professores
export const getProfessores = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id_funcionarios, nome_funcionario FROM funcionarios WHERE funcao = 'Professor' AND estado = 'ativo' ORDER BY nome_funcionario"
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar professores:', error);
    res.status(500).json({ error: 'Erro ao buscar professores' });
  }
};

// ✅ Buscar disciplinas
export const getDisciplinas = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id_disciplinas, nome_disciplina FROM disciplinas ORDER BY nome_disciplina'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
};

// ✅ Criar classe e relações
export const createClasse = async (req: Request, res: Response) => {
  const { nome, relacoes } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO classes (nome_classe) VALUES ($1) RETURNING id_classes',
      [nome]
    );

    const classeId = result.rows[0].id_classes;

    for (const rel of relacoes) {
      await client.query(
        'UPDATE classes SET id_professor = $1, id_disciplina = $2 WHERE id_classes = $3',
        [rel.professorId, rel.disciplinaId, classeId]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Classe criada com sucesso', classeId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar classe:', error);
    res.status(500).json({ error: 'Erro ao criar classe' });
  } finally {
    client.release();
  }
};
