import { Request, Response } from 'express';
import { AttendanceService } from './presencas.service';

const attendanceService = new AttendanceService();

export class AttendanceController {
  async registerBatch(req: Request, res: Response) {
    try {
      const result = await attendanceService.registerBatch(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async findByTurma(req: Request, res: Response) {
    try {
      const { turmaId, date } = req.query;
      const result = await attendanceService.findByTurma(
        turmaId as string,
        new Date(date as string)
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async findByStudent(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const { startDate, endDate } = req.query;
      const result = await attendanceService.findByStudent(
        studentId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReport(req: Request, res: Response) {
    try {
      const { turmaId, startDate, endDate } = req.query;
      const result = await attendanceService.getAttendanceReport(
        turmaId as string,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStudentsByTurma(req: Request, res: Response) {
    try {
      const { turmaId } = req.params;
      const result = await attendanceService.getStudentsByTurma(turmaId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
