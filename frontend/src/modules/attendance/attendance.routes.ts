 import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'List attendance records' });
});

router.post('/', (req: Request, res: Response) => {
  res.json({ message: 'Record attendance', body: req.body });
});

router.get('/student/:studentId', (req: Request, res: Response) => {
  res.json({ message: `Attendance for student ${req.params.studentId}` });
});

export default router;
