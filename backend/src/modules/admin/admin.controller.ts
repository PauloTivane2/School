import { Request, Response } from 'express';
import { pool } from '../../config/database';

export class AdminController {
  // 🔹 Buscar detalhes das turmas únicas por classe
  static async getClassesDetalhes(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT DISTINCT ON (t.id_turma)
          c.id_classes,
          c.nome_classe,
          t.turma,
          t.ano AS ano_letivo,
          d.nome_disciplina AS disciplina,
          d.carga_horaria,
          f.nome_funcionario AS professor_nome,
          co.contacto1,
          co.contacto2,
          co.contacto3
        FROM classes c
        LEFT JOIN turmas t ON t.id_classe = c.id_classes
        LEFT JOIN classes_relacoes cr ON cr.id_classe = c.id_classes
        LEFT JOIN disciplinas d ON d.id_disciplinas = cr.id_disciplina
        LEFT JOIN funcionarios f ON f.id_funcionarios = cr.id_professor
        LEFT JOIN contactos co ON co.id_funcionarios = f.id_funcionarios
        ORDER BY t.id_turma;
      `;

      const result = await pool.query(query);

      const data = result.rows.map((r: any) => ({
        id_classes: r.id_classes,
        nome_classe: `${r.nome_classe} - ${r.turma}`,
        ano_letivo: r.ano_letivo,
        disciplina: r.disciplina,
        carga_horaria: r.carga_horaria,
        professor: {
          nome: r.professor_nome,
          contacto1: r.contacto1,
          contacto2: r.contacto2,
          contacto3: r.contacto3,
        },
      }));

      // Evita duplicados (ex: "12classe turma A" aparecer 2x)
      const unicos = Array.from(
        new Map(data.map((item) => [item.nome_classe, item])).values()
      );

      res.json(unicos);
    } catch (error) {
      console.error('Erro em getClassesDetalhes:', error);
      res.status(500).json({ error: 'Erro ao buscar classes' });
    }
  }

  // 🔹 Excluir uma classe
  static async deleteClasse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM classes WHERE id_classes = $1', [id]);
      res.json({ success: true, message: 'Classe eliminada com sucesso' });
    } catch (error) {
      console.error('Erro em deleteClasse:', error);
      res.status(500).json({ error: 'Erro ao eliminar classe' });
    }
  }
}
