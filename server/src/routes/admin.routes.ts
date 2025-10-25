import { Router } from 'express';
import { AdminController } from '../modules/admin/admin.controller';

const router = Router();

router.get('/classes-detalhes', AdminController.getClassesDetalhes);
router.delete('/classes/:id', AdminController.deleteClasse);

export default router;
