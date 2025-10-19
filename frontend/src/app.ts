import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Routes
import authRoutes from './modules/auth/auth.routes';
import studentsRoutes from './modules/students/students.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import gradesRoutes from './modules/grades/grades.routes';
import examsRoutes from './modules/exams/exams.routes';
import reportsRoutes from './modules/reports/reports.routes';


// Middlewares
import { errorHandler } from './shared/middlewares/error-handler';
import { logger } from './shared/middlewares/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health check
app.get('/', (_req, res) => {
  res.send('API GestaEscolar rodando!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/alunos', studentsRoutes);
app.use('/api/pagamentos', paymentsRoutes);
app.use('/api/presencas', attendanceRoutes);
app.use('/api/notas', gradesRoutes);
app.use('/api/exames', examsRoutes);
app.use('/api/relatorios', reportsRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;