import { Router } from 'express';
import { ClassesController } from './classes.controller';

const router = Router();
const controller = new ClassesController();

// Rotas para CLASSES
router.get('/classes', controller.getAllClasses);
router.get('/classes/:id', controller.getClassById);
router.post('/classes', controller.createClass);
router.put('/classes/:id', controller.updateClass);
router.delete('/classes/:id', controller.deleteClass);

// Rotas para TURMAS
router.get('/turmas', controller.getAllTurmas);
router.get('/turmas/:id', controller.getTurmaById);
router.post('/turmas', controller.createTurma);
router.put('/turmas/:id', controller.updateTurma);
router.delete('/turmas/:id', controller.deleteTurma);

export default router;
