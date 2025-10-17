# Database Module

This module is responsible for configuring the connection to the PostgreSQL database and defining base entities.

## Purpose

The `DatabaseModule` uses TypeORM to connect to the database and manage the application's data models. It provides a centralized and asynchronous configuration for the database connection.

## Core Components

-   **`DatabaseModule`**: This module uses `TypeOrmModule.forRootAsync` to configure the database connection. This approach allows it to inject the `ConfigService` and use the application's configuration to get the necessary database credentials (host, port, username, etc.). This keeps credentials out of the source code and allows for different configurations per environment.

-   **`data-source.ts`**: This file exports an instance of the TypeORM `DataSource`. Its primary purpose is to be used by the TypeORM command-line interface (CLI) for running database migrations. It reads the database configuration directly from environment variables to create a connection.

-   **`BaseEntity`**: This is an abstract class that all other data entities in the application extend. It provides a set of common, boilerplate columns that are useful for all tables:
    -   `id`: A UUID primary key.
    -   `createdAt`: A timestamp automatically set on creation.
    -   `updatedAt`: A timestamp automatically updated on modification.
    -   `createdBy`: An optional field to track the user who created the record.
    -   `updatedBy`: An optional field to track the user who last updated the record.

By using this base entity, we ensure consistency across all data models.