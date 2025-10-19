import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'List exams' });
});

router.post('/', (req: Request, res: Response) => {
  res.json({ message: 'Create exam', body: req.body });
});

router.get('/:id', (req: Request, res: Response) => {
  res.json({ message: `Get exam ${req.params.id}` });
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ message: `Update exam ${req.params.id}`, body: req.body });
});

router.delete('/:id', (req: Request, res: Response) => {
  res.json({ message: `Delete exam ${req.params.id}` });
});

export default router;
