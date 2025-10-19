import { Router, Request, Response } from 'express';

const router = Router();

router.get('/students', (_req: Request, res: Response) => {
  res.json({ message: 'Student reports' });
});

router.get('/payments', (_req: Request, res: Response) => {
  res.json({ message: 'Payment reports' });
});

router.get('/attendance', (_req: Request, res: Response) => {
  res.json({ message: 'Attendance reports' });
});

router.get('/grades', (_req: Request, res: Response) => {
  res.json({ message: 'Grades reports' });
});

router.get('/student/:id', (req: Request, res: Response) => {
  res.json({ message: `Report for student ${req.params.id}` });
});

export default router;