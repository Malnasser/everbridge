import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ICacheService } from './interfaces/cache-service.interface';

@Injectable()
export class CacheService implements ICacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  getCacheKey<T>(
    id?: string | number | Partial<T>,
    select?: (keyof T)[] | undefined,
    entityType?: new () => T,
  ): string {
    const entityName = entityType ? entityType.name.toLowerCase() : 'unknown';
    const key = id
      ? typeof id === 'object'
        ? `${entityName}_${JSON.stringify(id)}`
        : `${entityName}_${id}`
      : `all_${entityName}s`;
    const selectKey = select && select.length > 0 ? select.join(',') : 'all';
    const finalKey = `${key}_select_${selectKey}`;
    console.log(`Generated cache key: ${finalKey}`);
    return finalKey;
  }

  getPaginationCacheKey<T>(
    page: number,
    limit: number,
    condition?: Partial<T>,
    select?: (keyof T)[] | undefined,
    sort?: Record<string, 'ASC' | 'DESC'>,
    entityType?: new () => T,
  ): string {
    const entityName = entityType ? entityType.name.toLowerCase() : 'unknown';
    const conditionKey = condition ? JSON.stringify(condition) : 'all';
    const selectKey = select && select.length > 0 ? select.join(',') : 'all';
    const sortKey = sort ? JSON.stringify(sort) : 'all';
    return `${entityName}_page_${page}_limit_${limit}_${conditionKey}_select_${selectKey}_sort_${sortKey}`;
  }
}
