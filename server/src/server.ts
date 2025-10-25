import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.routes';
import estudantesRoutes from './routes/estudantes.routes';
import turmasRoutes from './routes/turmas.routes';  
import funcionariosRoutes from './routes/funcionarios.routes';
import disciplinasRoutes from './routes/disciplinas.routes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/admin', adminRoutes);
app.use('/api/students', estudantesRoutes);
app.use('/api/turmas', turmasRoutes); 
app.use('/api/funcionarios', funcionariosRoutes); 
app.use('/api/disciplinas', disciplinasRoutes);

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
