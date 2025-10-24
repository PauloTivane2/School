import { Router } from 'express';
import { PaymentsController } from './payments.controller';

const router = Router();
const controller = new PaymentsController();

router.get('/stats', controller.getStats);
router.get('/student/:alunoId/total', controller.getTotalByStudent);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
