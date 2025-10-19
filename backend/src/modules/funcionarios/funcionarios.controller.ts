import { Request, Response } from 'express';
import { FuncionariosService } from './funcionarios.service';

const service = new FuncionariosService();

export class FuncionariosController {
  async findAll(req: Request, res: Response) {
    const funcionarios = await service.findAll();
    res.json(funcionarios);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const func = await service.findById(parseInt(id));
    if (!func) return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.json(func);
  }

  async create(req: Request, res: Response) {
    try {
      const funcionario = await service.create(req.body);
      res.status(201).json(funcionario);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const func = await service.update(parseInt(id), req.body);
      if (!func) return res.status(404).json({ error: 'Funcionário não encontrado' });
      res.json(func);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await service.delete(parseInt(id));
    res.status(204).send();
  }
}
