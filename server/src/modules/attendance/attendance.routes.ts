import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import { teacherScope } from '../../middleware/teacher-scope.middleware';

const router = Router();
const controller = new AttendanceController();

// RF10-RF11: Presenças (com RN04: professores só acessam suas turmas)
router.get('/', controller.getAll);
router.get('/turma', teacherScope.byTurma(), controller.getByTurmaAndDate);
router.get('/student/:alunoId', teacherScope.byStudent(), controller.getByStudent);
router.get('/report', teacherScope.byTurma(), controller.getReport);
router.get('/student/:alunoId/stats', teacherScope.byStudent(), controller.getStudentStats);
router.post('/', teacherScope.byTurma(), controller.create);
router.post('/batch', teacherScope.byTurma(), controller.batchCreate);

export default router;
