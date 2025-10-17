export interface ICacheService {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  getCacheKey<T>(
    id?: string | number | Partial<T>,
    select?: (keyof T)[] | undefined,
    entityType?: new () => T,
  ): string;
  getPaginationCacheKey<T>(
    page: number,
    limit: number,
    condition?: Partial<T>,
    select?: (keyof T)[] | undefined,
    sort?: Record<string, 'ASC' | 'DESC'>,
    entityType?: new () => T,
  ): string;
}
