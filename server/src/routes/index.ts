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

const router = Router();

/**
 * ===== ROTAS REFATORADAS COM PADRÃO MVC =====
 * RF01-RF04: Cadastros
 * RF05-RF09: Financeiro
 * RF10-RF11: Frequência
 * RF12-RF14: Notas
 */
router.use('/students', studentsRoutes);           // RF01: Gestão de Alunos (CRUD completo)
router.use('/guardians', guardiansRoutes);         // RF02: Gestão de Encarregados (CRUD completo)
router.use('/staff', staffRoutes);                 // RF03: Gestão de Funcionários/Docentes (CRUD completo)
router.use('/classes', classesRoutes);             // RF04: Gestão de Classes, Turmas e Horários (CRUD completo)
router.use('/payments', paymentsRoutes);           // RF05-RF09: Financeiro (Pagamentos)
router.use('/attendance', attendanceRoutes);       // RF10-RF11: Frequência (Presenças)
router.use('/grades', gradesRoutes);               // RF12-RF14: Notas e Boletins
router.use('/relatorios', reportsRoutes);          // RF15-RF19: Relatórios (Financeiro, Frequência, Acadêmico)

/**
 * ===== ROTAS EXISTENTES (MANTIDAS PARA COMPATIBILIDADE) =====
 */
router.use('/auth', authRoutes);                   // Autenticação (Login/Logout)
router.use('/funcionarios', funcionariosRoutes);   // RF03: Gestão de Funcionários
router.use('/encarregados', encarregadosRoutes);   // RF02: Gestão de Encarregados
router.use('/disciplinas', disciplinasRoutes);     // Disciplinas
router.use('/agenda', agendaRoutes);               // Agenda
router.use('/dropdowns', dropdownsRoutes);         // Dados para dropdowns
router.use('/admin', adminRoutes);                 // RF20-RF21: Administração

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
