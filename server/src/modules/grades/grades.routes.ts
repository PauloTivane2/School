import { Router } from 'express';
import { GradesController } from './grades.controller';

const router = Router();
const controller = new GradesController();

router.post('/', (req, res) => controller.create(req, res));
router.get('/student', (req, res) => controller.findByStudent(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.get('/boletim', (req, res) => controller.getBoletim(req, res));
router.get('/students/:turmaId', (req, res) => controller.getStudentsByTurma(req, res));
router.get('/disciplinas', (req, res) => controller.getDisciplinas(req, res));

export default router;