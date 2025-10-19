import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'List students' });
});

router.post('/', (_req: Request, res: Response) => {
  res.json({ message: 'Create student' });
});

router.get('/:id', (req: Request, res: Response) => {
  res.json({ message: `Get student ${req.params.id}` });
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ message: `Update student ${req.params.id}`, body: req.body });
});

router.delete('/:id', (req: Request, res: Response) => {
  res.json({ message: `Delete student ${req.params.id}` });
});

export default router;
