// src/modules/attendance/app.ts
import express from 'express';
import { AppDataSource } from '../../config/ormconfig';
import { AttendanceService } from './presencas.service';

const app = express();

app.use(express.json());

const attendanceService = new AttendanceService();

app.get('/api/v1/attendance', async (req, res) => {
  try {
    const { turmaId, startDate, endDate } = req.query;
    
    if (!turmaId || !startDate || !endDate) {
      return res.status(400).json({ message: 'turmaId, startDate e endDate são obrigatórios' });
    }

    const report = await attendanceService.getAttendanceReport(
      turmaId as string,  // ← MUDOU: mantém como string
      new Date(startDate as string),
      new Date(endDate as string)
    );
    
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter relatório de presença', error });
  }
});

(async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexão com o banco de dados estabelecida para o módulo attendance');
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco:', err);
  }
})();

export default app;