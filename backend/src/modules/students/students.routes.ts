import { Router } from 'express';
import { StudentsController } from './students.controller';

const router = Router();
const controller = new StudentsController();

/**
 * Rotas do módulo de estudantes
 */

// GET /api/students/count - Contar estudantes (deve vir antes de /:id)
router.get('/count', controller.count);

// GET /api/students/turma/:turmaId - Buscar por turma
router.get('/turma/:turmaId', controller.getByTurma);

// GET /api/students - Listar todos
router.get('/', controller.getAll);

// GET /api/students/:id - Buscar por ID
router.get('/:id', controller.getById);

// POST /api/students - Criar novo
router.post('/', controller.create);

// PUT /api/students/:id - Atualizar
router.put('/:id', controller.update);

// DELETE /api/students/:id - Deletar
router.delete('/:id', controller.delete);

export default router;
