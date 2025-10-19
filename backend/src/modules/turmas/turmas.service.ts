import { TurmasRepository, CreateTurmaDTO, Turma } from './turmas.repository';

const repo = new TurmasRepository();

export class TurmasService {
  findAll(): Promise<Turma[]> {
    return repo.findAll();
  }

  findById(id: number): Promise<Turma | null> {
    return repo.findById(id);
  }

  create(data: CreateTurmaDTO): Promise<Turma> {
    return repo.create(data);
  }

  update(id: number, data: Partial<CreateTurmaDTO>): Promise<Turma | null> {
    return repo.update(id, data);
  }

  delete(id: number): Promise<void> {
    return repo.delete(id);
  }
}
