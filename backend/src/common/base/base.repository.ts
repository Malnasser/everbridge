import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  FindOptionsOrder,
  EntityMetadata,
} from 'typeorm';
import { IBaseRepository } from './interfaces';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected repository: Repository<T>;

  get metadata(): EntityMetadata {
    return this.repository.metadata;
  }

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return await this.repository.save(newEntity);
  }

  async findById(
    id: string | number,
    select?: (keyof T)[] | undefined,
    relations?: string[],
  ): Promise<T | null> {
    const primaryKey = this.repository.metadata.primaryColumns[0].propertyName;
    return await this.repository.findOne({
      where: { [primaryKey]: id } as FindOptionsWhere<T>,
      select: select,
      relations,
    });
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async update(id: string | number, entity: Partial<T>): Promise<T | null> {
    await this.repository.update(id, entity as any);
    return await this.findById(id);
  }

  async delete(id: string | number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findByCondition(condition: Partial<T>): Promise<T[]> {
    return await this.repository.find({
      where: condition as FindOptionsWhere<T>,
    });
  }

  async findOne(condition: Partial<T>): Promise<T | null> {
    return await this.repository.findOne({
      where: condition as FindOptionsWhere<T>,
    });
  }

  async count(condition?: Partial<T>): Promise<number> {
    return await this.repository.count({
      where: condition as FindOptionsWhere<T>,
    });
  }

  async exists(condition: Partial<T>): Promise<boolean> {
    const count = await this.count(condition);
    return count > 0;
  }

  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    condition?: Partial<T>,
    select?: (keyof T)[] | undefined,
    sort?: FindOptionsOrder<T>,
    relations?: string[],
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.repository.findAndCount({
      where: condition as FindOptionsWhere<T>,
      skip: (page - 1) * limit,
      take: limit,
      select,
      order: sort,
      relations,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
