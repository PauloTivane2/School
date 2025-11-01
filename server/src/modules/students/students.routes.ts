import { Router } from 'express';
import { StudentsController } from './students.controller';

const router = Router();
const controller = new StudentsController();

// Rotas de estudantes
router.get('/', (req, res) => controller.getAll(req, res));
router.get('/count', (req, res) => controller.count(req, res));
router.get('/turma/:turmaId', (req, res) => controller.getByTurma(req, res));

// Rotas de dropdowns
router.get('/dropdowns/classes', (req, res) => controller.getClassesDropdown(req, res));
router.get('/dropdowns/turmas', (req, res) => controller.getTurmasDropdown(req, res));
router.get('/dropdowns/encarregados', (req, res) => controller.getEncarregadosDropdown(req, res));

router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;


