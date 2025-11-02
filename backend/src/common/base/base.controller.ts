import { PaginationQueryDto, PaginationRes } from './dto';
import { IBaseService } from './interfaces';
import { BadRequestException } from '@nestjs/common';

export abstract class BaseController<T> {
  constructor(protected baseService: IBaseService<T>) {}

  protected _create(entity: T): Promise<T> {
    return this.baseService.create(entity);
  }

  protected _findAll(
    query: PaginationQueryDto,
    relations?: string[],
  ): Promise<PaginationRes<T>> {
    const { page = 1, limit = 10, filter, select, sort } = query;

    const columns = this.baseService.repository.metadata.columns;
    const columnNames = columns.map((col) => col.propertyName);
    let filterObject: Partial<T> | undefined;
    if (filter) {
      try {
        filterObject = filter.split(',').reduce((acc, part) => {
          const [key, value] = part.split(':');
          const trimmedKey = key?.trim();
          if (!trimmedKey || value === undefined) {
            throw new BadRequestException(
              'Invalid filter format. Expected key:value pairs.',
            );
          }

          const column = columns.find((c) => c.propertyName === trimmedKey);
          if (!column) {
            throw new BadRequestException(
              `Invalid filter key "${trimmedKey}". Allowed keys: ${columns
                .map((c) => c.propertyName)
                .join(', ')}`,
            );
          }

          // validate value based on type
          switch (column.type) {
            case 'int':
            case 'integer':
              if (isNaN(Number(value))) {
                throw new BadRequestException(
                  `Invalid value for "${trimmedKey}". Expected number.`,
                );
              }
              acc[trimmedKey as keyof T] = Number(value) as any;
              break;

            case 'timestamp':
            case 'datetime':
            case 'date':
              if (isNaN(Date.parse(value))) {
                throw new BadRequestException(
                  `Invalid value for "${trimmedKey}". Expected date/time string.`,
                );
              }
              acc[trimmedKey as keyof T] = new Date(value) as any;
              break;

            case 'boolean':
              if (value !== 'true' && value !== 'false') {
                throw new BadRequestException(
                  `Invalid value for "${trimmedKey}". Expected boolean ("true" or "false").`,
                );
              }
              acc[trimmedKey] = value === 'true';
              break;

            default:
              acc[trimmedKey as keyof T] = value.trim() as any;
          }

          return acc;
        }, {} as Partial<T>);
      } catch (e) {
        if (e instanceof BadRequestException) throw e;
        throw new BadRequestException(
          'Invalid filter query parameter. Expected format: key:value,key:value',
        );
      }
    }

    let selectFields: (keyof T)[] | undefined;
    if (select) {
      const columns = this.baseService.repository.metadata.columns.map(
        (col) => col.propertyName,
      );

      try {
        selectFields = select
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
          .map((field) => {
            if (!columns.includes(field)) {
              throw new BadRequestException(
                `Invalid select key "${field}". Allowed keys: ${columns.join(', ')}`,
              );
            }
            return field as keyof T;
          });
      } catch (e) {
        if (e instanceof BadRequestException) throw e;
        throw new BadRequestException(
          'Invalid select query parameter. Expected format: key1,key2,key3',
        );
      }
    }

    let sortObject: Record<string, 'ASC' | 'DESC'> | undefined;
    if (sort) {
      try {
        sortObject = sort.split(',').reduce(
          (acc, part) => {
            const [key, direction] = part.split(':');
            const trimmedKey = key?.trim();
            const dir = direction?.trim().toUpperCase();

            if (!trimmedKey || !dir) {
              throw new BadRequestException(
                'Invalid sort format. Expected key:direction pairs (e.g., title:ASC).',
              );
            }

            if (!columnNames.includes(trimmedKey)) {
              throw new BadRequestException(
                `Invalid sort key "${trimmedKey}". Allowed keys: ${columns.join(', ')}`,
              );
            }

            if (dir !== 'ASC' && dir !== 'DESC') {
              throw new BadRequestException(
                `Invalid sort direction "${dir}". Allowed values: ASC, DESC.`,
              );
            }

            acc[trimmedKey] = dir as 'ASC' | 'DESC';
            return acc;
          },
          {} as Record<string, 'ASC' | 'DESC'>,
        );
      } catch (e) {
        if (e instanceof BadRequestException) throw e;
        throw new BadRequestException(
          'Invalid sort query parameter. Expected format: key:direction,key:direction',
        );
      }
    }

    let filteredRelations: string[] | undefined;
    if (relations && selectFields) {
      filteredRelations = relations.filter((relation) =>
        selectFields.includes(relation as keyof T),
      );
    } else {
      filteredRelations = relations; // no selectFields => include all
    }

    // Then call your service
    return this.baseService.findWithPagination(
      page,
      limit,
      filterObject as Partial<T>,
      selectFields,
      sortObject,
      filteredRelations,
    );
  }

  protected _findOne(
    id: string,
    select?: string,
    relations?: string[],
  ): Promise<T | null> {
    let selectFields: (keyof T)[] | undefined;
    if (select) {
      const columns = this.baseService.repository.metadata.columns.map(
        (col) => col.propertyName,
      );

      try {
        selectFields = select
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
          .map((field) => {
            if (!columns.includes(field)) {
              throw new BadRequestException(
                `Invalid select key "${field}". Allowed keys: ${columns.join(', ')}`,
              );
            }
            return field as keyof T;
          });
      } catch (e) {
        if (e instanceof BadRequestException) throw e;
        throw new BadRequestException(
          'Invalid select query parameter. Expected format: key1,key2,key3',
        );
      }
    }

    let filteredRelations: string[] | undefined;
    if (relations && selectFields) {
      filteredRelations = relations.filter((relation) =>
        selectFields.includes(relation as keyof T),
      );
    } else {
      filteredRelations = relations; // no selectFields => include all
    }

    return this.baseService.findById(id, selectFields, filteredRelations);
  }

  protected _update(id: string, entity: T): Promise<T | null> {
    return this.baseService.update(id, entity);
  }
}
