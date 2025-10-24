import { Router } from 'express';
import { GradesController } from './grades.controller';

const router = Router();
const controller = new GradesController();

router.get('/boletim', controller.getBoletim);
router.get('/student', controller.findByStudent);
router.get('/students/:turmaId', controller.getStudentsByTurma);
router.get('/disciplinas', controller.getDisciplinas);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);

export default router;
