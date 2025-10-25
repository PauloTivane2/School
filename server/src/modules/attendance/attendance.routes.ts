import { Router } from 'express';
import { AttendanceController } from './attendance.controller';

const router = Router();
const controller = new AttendanceController();

router.post('/', (req, res) => controller.create(req, res));
router.get('/student/:studentId', (req, res) => controller.findByStudent(req, res));
router.get('/class/:classId', (req, res) => controller.findByClass(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;
