import { Router } from 'express';
import { AdminController } from './admin.controller';

const router = Router();
const controller = new AdminController();

router.get('/dashboard', (req, res) => controller.getDashboard(req, res));
router.get('/stats', (req, res) => controller.getStats(req, res));
router.get('/classes-detalhes', (req, res) => AdminController.getClassesDetalhes(req, res));
router.delete('/classes/:id', (req, res) => controller.deleteClasse(req, res));

export default router;
