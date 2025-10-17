# Users Module

This module is responsible for managing user data within the CMS. It provides endpoints for retrieving and updating user information.

## Purpose

The `UsersModule` provides a way to interact with user entities. While user creation is handled by the `AuthModule` during the registration process, this module allows for viewing and modifying existing user data.

## API Endpoints

The module exposes the following RESTful endpoints under the `/users` path:

| Method | Path   | Description                |
| ------ | ------ | -------------------------- |
| `GET`  | `/`    | Retrieves all users (paginated). |
| `GET`  | `/:id` | Retrieves a single user by their ID. |
| `PATCH`| `/:id` | Updates an existing user's information. |

**Note:** This module does not provide endpoints for creating or deleting users. User creation is handled by the authentication flow, and deletion is likely a restricted administrative action.

## Entity Schema

The `User` entity represents a user of the CMS:

| Field       | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `id`        | `uuid`   | The unique identifier for the user.              |
| `email`     | `string` | The user's email address (must be unique).       |
| `password`  | `string` | The user's hashed password.                      |
| `firstName` | `string` | The user's first name.                           |
| `lastName`  | `string` | The user's last name.                            |

## Repository and Service

The `UserRepository` implements a custom `findByEmail` method, which is essential for the authentication process. The `UsersService` extends the `BaseService` to provide standard data management functionalities and caching.