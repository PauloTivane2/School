// backend/src/modules/admin/repositories/classesRepository.ts
import { pool } from '../../config/database';

export async function getAllClassesDetails() {
  const query = `
    SELECT 
      c.id,
      t.nome AS nome,
      t.ano_letivo,
      d.nome AS disciplina,
      d.carga_horaria,
      f.nome AS professor_nome,
      ct.contacto1,
      ct.contacto2,
      ct.contacto3
    FROM classes c
    JOIN turmas t ON c.turma_id = t.id
    JOIN disciplinas d ON c.disciplina_id = d.id
    LEFT JOIN funcionarios f ON c.professor_id = f.id
    LEFT JOIN contactos ct ON ct.funcionario_id = f.id
    ORDER BY t.ano_letivo, t.nome, d.nome;
  `;

  const result = await pool.query(query);
  return result.rows.map((r: any) => ({
    id: r.id,
    nome: r.nome,
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
}
