import { Request, Response } from 'express';
import { PaymentsService } from './pagamentos.service';

const paymentsService = new PaymentsService();

export class PaymentsController {
  async findAll(req: Request, res: Response) {
    try {
      const payments = await paymentsService.findAll();
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await paymentsService.findById(id);
      if (!payment) {
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      }
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const payment = await paymentsService.create(req.body);
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await paymentsService.update(id, req.body);
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await paymentsService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}