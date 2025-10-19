import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initDatabase } from './config/database';

// 🧭 Rotas principais
import adminRoutes from './routes/admin.routes';
import classeRoutes from './routes/classes.routes';
import studentsRoutes from './routes/estudantes.routes';  
import funcionariosRoutes from './routes/funcionarios.routes';

const app: Application = express();

// 🔒 Middlewares globais
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 🧭 Rotas principais
app.use('/api/admin', adminRoutes);
app.use('/api/classes', classeRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/funcionarios', funcionariosRoutes);  

// 🌍 Rota padrão (API base)
app.use('/api/v1', (_req: Request, res: Response) => {
  res.json({ message: 'API Gestão Escolar v1.0' });
});

// ⚠️ Tratamento para rotas inexistentes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Rota não encontrada',
  });
});

// 🛠️ Tratamento global de erros
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 🚀 Inicializar banco de dados e iniciar servidor
initDatabase()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Backend rodando em: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Falha ao conectar ao banco de dados:', err);
    process.exit(1);
  });

export default app;
