# Cache Module

This module provides a caching layer for the application, leveraging a Redis backend to store and retrieve frequently accessed data.

## Purpose

The `CacheModule` is designed to improve application performance by reducing the number of expensive database queries. It is used by the `BaseService` in the `cms` module to automatically cache the results of `find` operations.

## Core Components

-   **`CacheModule`**: This module uses NestJS's `@nestjs/cache-manager` to configure a global cache store. It is set up to use `cache-manager-redis-store`, connecting to the Redis instance specified in the application configuration.

-   **`CacheService`**: This service provides a simple, unified interface for interacting with the cache. It abstracts the underlying `cache-manager` and exposes three main methods:
    -   `get<T>(key: string)`: Retrieves a value from the cache.
    -   `set<T>(key: string, value: T, ttl?: number)`: Stores a value in the cache with an optional time-to-live (TTL).
    -   `del(key: string)`: Deletes a value from the cache.

## Cache Key Generation

The `CacheService` also includes two important helper methods for generating consistent cache keys:

-   **`getCacheKey()`**: Creates a standardized key for individual entities or lists of entities.
-   **`getPaginationCacheKey()`**: Creates a standardized key for paginated query results, taking into account page, limit, filters, and sorting.

This consistent key generation is crucial for effective caching and cache invalidation, which is handled automatically by the `BaseService`.