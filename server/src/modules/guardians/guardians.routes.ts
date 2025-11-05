import { Router, Request, Response, NextFunction } from 'express';
import { GuardiansController } from './guardians.controller';

const router = Router();
const controller = new GuardiansController();

/**
 * Rotas de Encarregados
 * RF02: Criar/editar/eliminar encarregado
 */

// Rotas específicas do encarregado (devem vir ANTES das rotas com :id)
router.get('/meus-alunos', controller.getMyStudents.bind(controller));
router.get('/dashboard', controller.getDashboard.bind(controller));
router.get('/aluno/:studentId/notas', controller.getStudentGrades.bind(controller));
router.get('/aluno/:studentId/presencas', controller.getStudentAttendance.bind(controller));
router.get('/aluno/:studentId/pagamentos', controller.getStudentPayments.bind(controller));
router.get('/aluno/:studentId/exames', controller.getStudentExams.bind(controller));
router.post('/aluno/:studentId/exportar', controller.exportStudentReport.bind(controller));

// Rotas de pagamento M-Pesa
router.post('/pagamento/mpesa', controller.processMpesaPayment.bind(controller));
router.get('/pagamento/carteiras', controller.getMpesaWallets.bind(controller));

// Rotas administrativas
router.get('/', controller.getAll.bind(controller));
router.get('/count', controller.count.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
