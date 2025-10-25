/**
 * Interface base para todos os repositórios
 */
export interface BaseRepository<T, CreateDTO, UpdateDTO> {
  findAll(filters?: any): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  create(data: CreateDTO): Promise<T>;
  update(id: string | number, data: UpdateDTO): Promise<T>;
  delete(id: string | number): Promise<void>;
  count(filters?: any): Promise<number>;
}
