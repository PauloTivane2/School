import { Router } from 'express';
import { GradesController } from './grades.controller';
import { teacherScope } from '../../middleware/teacher-scope.middleware';

const router = Router();
const controller = new GradesController();

// RF12-RF14: Notas e Boletins (com RN04: professores só acessam suas turmas)
router.get('/', controller.getAll);
router.get('/student', controller.findByStudent); // Admin pode ver todos; Professor filtrado pelo service
router.get('/boletim', controller.getBoletim); // Admin pode ver todos; Professor filtrado pelo service
router.get('/students/:turmaId', teacherScope.byTurma(), controller.getStudentsByTurma);
router.get('/disciplinas', controller.getDisciplinas);
router.post('/', teacherScope.byStudent(), controller.create);
router.put('/:id', controller.update); // TODO: validar propriedade da nota

export default router;