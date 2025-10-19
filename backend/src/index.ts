// src/index.ts
import express from 'express';
import { AppDataSource } from '@config/ormconfig';
import { GradesRepository } from '@modules/grades/grades.repository';

const app = express();
const PORT = 3000;

// Middleware para JSON
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('Backend rodando!');
});

// Inicializar banco e servidor
(async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexão com o banco de dados estabelecida');

    // Exemplo de uso do GradesRepository
    const gradesRepository = new GradesRepository;
    console.log('GradesRepository inicializado');

    app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error('❌ Erro ao iniciar backend:', err);
  }
})();