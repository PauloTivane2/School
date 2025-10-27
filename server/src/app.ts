import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initDatabase } from './config/database';
import { runSeedIfNeeded } from './database/seed';

// Middlewares globais
import { errorHandler } from './core/middleware/error-handler.middleware';

// Rotas centralizadas
import routes from './routes';

const app: Application = express();

// 🔒 Middlewares de segurança e parsing
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
    message: 'Sistema de Gestão Escolar',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 🧭 Rotas da API (centralizadas)
app.use('/api', routes);

// 🌍 Rota raiz
app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    message: 'API Sistema de Gestão Escolar v2.0',
    documentation: '/api',
    health: '/health',
  });
});

// ⚠️ Tratamento para rotas não encontradas
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Rota não encontrada',
      code: 'ROUTE_NOT_FOUND',
    },
    timestamp: new Date().toISOString(),
  });
});

// 🛠️ Middleware global de tratamento de erros (deve ser o último)
app.use(errorHandler);

// 🚀 Inicializar banco de dados e iniciar servidor
initDatabase()
  .then(async () => {
    // Executar seed se necessário
    await runSeedIfNeeded();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log('✅ SISTEMA DE GESTÃO ESCOLAR - BACKEND');
      console.log('='.repeat(60));
      console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Base: http://localhost:${PORT}/api`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(60));
    });
  })
  .catch((err) => {
    console.error('❌ Falha ao conectar ao banco de dados:', err);
    process.exit(1);
  });

export default app;
