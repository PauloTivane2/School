import { Router } from 'express';
import { AttendanceController } from './attendance.controller';

const router = Router();
const controller = new AttendanceController();

router.get('/report', controller.getReport);
router.get('/turma', controller.getByTurmaAndDate);
router.get('/student/:alunoId', controller.getByStudent);
router.get('/student/:alunoId/stats', controller.getStudentStats);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.post('/batch', controller.batchCreate);

export default router;
