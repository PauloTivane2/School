import { Router } from 'express';
import { GuardiansController } from './guardians.controller';

const router = Router();
const controller = new GuardiansController();

/**
 * Rotas de Encarregados
 * RF02: Criar/editar/eliminar encarregado
 */
router.get('/', (req, res) => controller.getAll(req, res));
router.get('/count', (req, res) => controller.count(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;
