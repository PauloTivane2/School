import { Router } from 'express';
import { AttendanceController } from './presencas.controller';

const router = Router();
const controller = new AttendanceController();

router.post('/batch', (req, res) => controller.registerBatch(req, res));
router.get('/turma', (req, res) => controller.findByTurma(req, res));
router.get('/student/:studentId', (req, res) => controller.findByStudent(req, res));
router.get('/report', (req, res) => controller.getReport(req, res));
router.get('/students/:turmaId', (req, res) => controller.getStudentsByTurma(req, res));

export default router;