import { Router } from 'express';
import { ReportsController } from './reports.controller';

const router = Router();
const controller = new ReportsController();

// Relatórios principais
router.get('/financeiro', (req, res) => controller.getFinancialReport(req, res));
router.get('/frequencia', (req, res) => controller.getAttendanceReport(req, res));
router.get('/academico', (req, res) => controller.getAcademicReport(req, res));

// Relatórios específicos
router.get('/boletim/:alunoId', (req, res) => controller.getStudentReport(req, res));
router.get('/inadimplentes', (req, res) => controller.getDefaultersReport(req, res));
router.get('/exames', (req, res) => controller.getExamCandidatesReport(req, res));

// Dashboard
router.get('/dashboard', (req, res) => controller.getDashboardData(req, res));

export default router;
