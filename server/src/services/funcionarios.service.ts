import { FuncionariosRepository, CreateFuncionarioDTO, Funcionario } from './funcionarios.repository';

const repo = new FuncionariosRepository();

export class FuncionariosService {
  findAll(): Promise<Funcionario[]> {
    return repo.findAll();
  }

  findById(id: number): Promise<Funcionario | null> {
    return repo.findById(id);
  }

  create(data: CreateFuncionarioDTO): Promise<Funcionario> {
    return repo.create(data);
  }

  update(id: number, data: Partial<CreateFuncionarioDTO> & { ativo?: boolean }): Promise<Funcionario | null> {
    return repo.update(id, data);
  }

  delete(id: number): Promise<void> {
    return repo.delete(id);
  }
}
