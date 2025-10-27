import { Router } from 'express';
import { StaffController } from './staff.controller';

const router = Router();
const controller = new StaffController();

/**
 * Rotas de Funcionários/Docentes
 * RF03: Criar/editar/eliminar funcionário/docente
 */
router.get('/', (req, res) => controller.getAll(req, res));
router.get('/count', (req, res) => controller.count(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.post('/authenticate', (req, res) => controller.authenticate(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;
