import { Router } from 'express';
import { ClassesController } from './classes.controller';

const router = Router();
const controller = new ClassesController();

// Rotas de classes/turmas
router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;
