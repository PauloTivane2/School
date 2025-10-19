import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'List grades' });
});

router.post('/', (req: Request, res: Response) => {
  res.json({ message: 'Create grade', body: req.body });
});

router.get('/student/:studentId', (req: Request, res: Response) => {
  res.json({ message: `Grades for student ${req.params.studentId}` });
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ message: `Update grade ${req.params.id}`, body: req.body });
});

export default router;
