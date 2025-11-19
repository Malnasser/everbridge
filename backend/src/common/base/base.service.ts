import {
  FindManyOptions,
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
} from 'typeorm';
import { IBaseService, IBaseRepository } from './interfaces';

export abstract class BaseService<T> implements IBaseService<T> {
  protected baseRepository: IBaseRepository<T>;

  get repository(): IBaseRepository<T> {
    return this.baseRepository;
  }
  protected entityType: new () => T;

  constructor(baseRepository: IBaseRepository<T>, entityType: new () => T) {
    this.baseRepository = baseRepository;
    this.entityType = entityType;
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    const createdEntity = await this.baseRepository.create(entity);
    return createdEntity;
  }

  async findById(
    id: string | number,
    select?: (keyof T)[] | undefined,
    relations?: string[],
  ): Promise<T | null> {
    const data = await this.baseRepository.findById(id, select, relations);
    return data;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    const data = await this.baseRepository.findAll(options);
    return data;
  }

  async update(id: string | number, entity: Partial<T>): Promise<T | null> {
    const updatedEntity = await this.baseRepository.update(id, entity);
    return updatedEntity;
  }

  async findOne(condition: FindOptionsWhere<T>): Promise<T | null> {
    const data = await this.baseRepository.findOne(condition);
    return data;
  }

  async count(condition?: Partial<T>): Promise<number> {
    return this.baseRepository.count(condition);
  }

  async exists(condition: Partial<T>): Promise<boolean> {
    return this.baseRepository.exists(condition);
  }

  async findWithPagination(
    page: number,
    limit: number,
    filter?: Partial<T>,
    select?: (keyof T)[] | undefined,
    sort?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const result = await this.baseRepository.findWithPagination(
      page,
      limit,
      filter,
      select,
      sort as FindOptionsOrder<T>,
      relations,
    );

    return { ...result, page, limit };
  }
}
