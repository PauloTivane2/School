import { Router, Request, Response } from 'express';

// ===== ROTAS REFATORADAS (ARQUITETURA MVC COMPLETA) =====
import studentsRoutes from '../modules/students/students.routes';
import classesRoutes from '../modules/classes/classes.routes';
import paymentsRoutes from '../modules/payments/payments.routes';
import attendanceRoutes from '../modules/attendance/attendance.routes';
import gradesRoutes from '../modules/grades/grades.routes';
import adminRoutes from '../modules/admin/admin.routes';
import guardiansRoutes from '../modules/guardians/guardians.routes';
import staffRoutes from '../modules/staff/staff.routes';
import reportsRoutes from '../modules/reports/reports.routes';

// ===== ROTAS EXISTENTES (COMPATIBILIDADE) =====
import authRoutes from './auth.routes';
import funcionariosRoutes from './funcionarios.routes';
import encarregadosRoutes from './encarregados';
import disciplinasRoutes from './disciplinas.routes';
import agendaRoutes from './agendaRoutes';
import dropdownsRoutes from './dropdownsRoutes';
import mpesaRoutes from './mpesa.routes';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorize, teacherScopeMiddleware, guardianScopeMiddleware } from '../middleware/rbac.middleware';
import { auditLogMiddleware, financialAuditMiddleware, gradeAuditMiddleware } from '../middleware/audit-log.middleware';

const router = Router();

// Apply audit logging to all routes
router.use(auditLogMiddleware);

/**
 * ===== ROTAS REFATORADAS COM PADRÃO MVC =====
 * RF01-RF04: Cadastros
 * RF05-RF09: Financeiro
 * RF10-RF11: Frequência
 * RF12-RF14: Notas
 */
// RN01, RN04: Role-based access with data scoping
router.use('/students', authMiddleware, authorize('Admin', 'Professor', 'Encarregado'), guardianScopeMiddleware, teacherScopeMiddleware, studentsRoutes);           // RF01: Gestão de Alunos
router.use('/guardians', authMiddleware, authorize('Admin', 'Encarregado'), guardianScopeMiddleware, guardiansRoutes);                      // RF02: Encarregados
router.use('/staff', authMiddleware, authorize('Admin'), staffRoutes);                                             // RF03: Funcionários (Admin only)
router.use('/classes', authMiddleware, authorize('Admin', 'Professor'), teacherScopeMiddleware, classesRoutes);                            // RF04: Classes/Turmas
router.use('/payments', authMiddleware, authorize('Admin', 'Tesouraria'), financialAuditMiddleware, paymentsRoutes);                         // RF05-RF09: Financeiro
router.use('/attendance', authMiddleware, authorize('Admin', 'Professor'), teacherScopeMiddleware, attendanceRoutes);                      // RF10-RF11: Presenças
router.use('/grades', authMiddleware, authorize('Admin', 'Professor'), gradeAuditMiddleware, teacherScopeMiddleware, gradesRoutes);                              // RF12-RF14: Notas
router.use('/relatorios', authMiddleware, authorize('Admin', 'Professor', 'Tesouraria'), reportsRoutes);           // RF15-RF19: Relatórios

/**
 * ===== ROTAS EXISTENTES (MANTIDAS PARA COMPATIBILIDADE) =====
 */
router.use('/auth', authRoutes);                                                                                   // Autenticação (Login/Logout)
router.use('/funcionarios', authMiddleware, authorize('Admin'), funcionariosRoutes);                                // RF03: Funcionários (Admin only)
router.use('/encarregados', authMiddleware, authorize('Admin', 'Encarregado'), guardianScopeMiddleware, encarregadosRoutes);                 // RF02: Encarregados
router.use('/disciplinas', authMiddleware, authorize('Admin', 'Professor'), disciplinasRoutes);                     // Disciplinas
router.use('/agenda', authMiddleware, authorize('Admin', 'Professor'), teacherScopeMiddleware, agendaRoutes);                               // Agenda
router.use('/dropdowns', authMiddleware, dropdownsRoutes);                                                          // Dados para dropdowns
router.use('/admin', authMiddleware, authorize('Admin'), adminRoutes);                                              // Administração (Admin only)
router.use('/mpesa', authMiddleware, authorize('Admin', 'Tesouraria'), financialAuditMiddleware, mpesaRoutes);                                // Pagamentos M-Pesa

// Rota raiz da API
router.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'API Sistema de Gestão Escolar v2.0',
    version: '2.0.0',
    status: 'operational',
    modules: {
      refactored: ['students', 'guardians', 'staff', 'classes', 'payments', 'attendance', 'grades'],
      legacy: ['funcionarios', 'encarregados', 'disciplinas', 'agenda', 'dropdowns'],
      admin: ['admin'],
      auth: ['auth'],
    },
  });
});

export default router;

