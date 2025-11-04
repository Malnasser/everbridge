# EverBridge - Service

This directory contains the core backend service for the EverBridge. It is a [NestJS](https://nestjs.com/) application responsible for managing all CMS data, including programs, episodes, categories, users, and media assets.

## Architecture

The service is built with a modular architecture, separating concerns into three main layers:

-   `Core`: Handles cross-cutting concerns like authentication (`auth`), database configuration (`database`), caching (`cache`), application configuration (`config`), and object storage (`s3`).
-   `CMS`: Contains the primary business logic for managing CMS entities. Each entity (e.g., `programs`, `episodes`, `categories`) has its own dedicated module.
-   `Discovery`: Implements features related to content discovery, such as search functionality.

## Getting Started

Instructions for running this service are part of the main project documentation. Please refer to the root `README.md` for detailed steps on running the service either with Docker or locally.

### Scripts

The following scripts are available in the `package.json`:

| Script                 | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `build`                | Compiles the TypeScript source code into JavaScript.                        |
| `format`               | Formats code using Prettier.                                                |
| `start`                | Runs the compiled application.                                              |
| `start:dev`            | Runs the application in watch mode for development.                         |
| `start:prod`           | Runs the application in production mode.                                    |
| `lint`                 | Lints the codebase using ESLint.                                            |
| `test`                 | Runs unit tests.                                                            |
| `test:e2e`             | Runs end-to-end tests.                                                      |
| `migration:generate`   | Generates a new TypeORM migration file based on entity changes.             |
| `migration:run`        | Executes pending database migrations.                                       |
| `migration:revert`     | Reverts the last executed migration.                                        |

### Environment Variables

The service requires a set of environment variables to run correctly. These are defined in `src/.env.example`. For local development, create a `.env` file in the `src` directory and populate it with the necessary values.

```bash
# From the project root
cp services/src/.env.example services/src/.env
```

### Local DynamoDB Setup
aws dynamodb create-table \
  --table-name publish_table \
  --attribute-definitions \
      AttributeName=id,AttributeType=S \
      AttributeName=categoryId,AttributeType=S \
      AttributeName=language,AttributeType=S \
      AttributeName=status,AttributeType=S \
      AttributeName=publishDate,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes \
  --endpoint-url http://localhost:8000

```