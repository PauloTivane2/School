import { Router } from 'express';
import { AdminController } from './admin.controller';

const router = Router();
const controller = new AdminController();

router.get('/dashboard', (req, res) => controller.getDashboard(req, res));
router.get('/stats', (req, res) => controller.getStats(req, res));
router.get('/classes-detalhes', controller.getClassesDetalhes);
router.delete('/classes/:id', controller.deleteClasse);

export default router;
