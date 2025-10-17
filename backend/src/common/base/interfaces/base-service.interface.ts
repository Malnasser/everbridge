import { IBaseRepository } from './base-repoitory.interface';

export interface IBaseService<T> {
  repository: IBaseRepository<T>;
  create(dto: T): Promise<T>;
  findWithPagination(
    page: number,
    limit: number,
    filter?: Partial<T>,
    select?: (keyof T)[],
    sort?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<{ data: T[]; total: number; page: number; limit: number }>;
  findById(
    id: string,
    select?: (keyof T)[],
    relations?: string[],
  ): Promise<T | null>;
  update(id: string, dto: T): Promise<T | null>;
}
