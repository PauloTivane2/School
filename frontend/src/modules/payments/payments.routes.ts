 import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'List payments' });
});

router.post('/', (req: Request, res: Response) => {
  res.json({ message: 'Create payment', body: req.body });
});

router.get('/:id', (req: Request, res: Response) => {
  res.json({ message: `Get payment ${req.params.id}` });
});

export default router;