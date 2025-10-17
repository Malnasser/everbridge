# Config Module

This module is responsible for managing application configuration and environment variables. It also plays a crucial role in setting up global application providers, such as guards.

## Purpose

The `AppConfigModule` centralizes configuration management, making it easy to access settings throughout the application in a structured and type-safe manner.

## Core Components

-   **`ConfigModule`**: This module from `@nestjs/config` is configured to be global (`isGlobal: true`), meaning its services are available everywhere without needing to import `AppConfigModule` in other modules. It is set up to load the custom configuration defined in `app.config.ts`.

-   **`app.config.ts`**: This file defines the shape of the application's configuration object. It uses the `registerAs` function to create a namespaced configuration (`'app'`) that pulls values from environment variables (`process.env`). This provides a single, organized source for all configuration related to:
    -   Database connections
    -   JWT secrets and expiration times
    -   Redis connection details
    -   AWS S3 credentials and settings

## Global JWT Guard

A critical function of this module is to provide the `JwtAuthGuard` as a global guard using the `APP_GUARD` provider. This means that **all endpoints in the application are protected by default** and require a valid JWT for access. To expose a public endpoint, the `@Public()` decorator from the `AuthModule` must be used.