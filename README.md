# Thmanyah Streaming CMS

## Getting Started

This document provides instructions on how to set up and run the Thmanyah Streaming CMS for local development.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [pnpm](https://pnpm.io/installation)

### Running with Docker (Recommended)

The easiest way to get the entire system running is by using Docker Compose. This will start the CMS service along with its dependencies (PostgreSQL, Redis, MinIO).

1.  **Build and start the services:**

    Use the `-d` flag to run the services in the background.

    ```bash
    docker-compose up --build -d
    ```

2.  **Run database migrations:**

    After the services are running, execute the database migrations inside the `cms-service` container.

    ```bash
    docker-compose exec cms-service pnpm run migration:run
    ```

3.  **Accessing the services:**
    *   **CMS API:** `http://localhost:3001`
    *   **MinIO Console:** `http://localhost:9001` (Credentials: `minioadmin`/`minioadmin`)
    *   **PostgreSQL:** Connect on port `5432`
    *   **Redis:** Connect on port `6379`
    *   **DynamoDB Admin:** `http://localhost:8001`

The API documentation can be found at `http://localhost:3001/api`.

### Running Locally

If you prefer to run the main service on your host machine, you can use Docker to run the databases and then start the service manually.

1. **Start the databases:**

    Start the required PostgreSQL, Redis, and MinIO services using Docker Compose.

    ```bash
    docker-compose up -d db redis minio
    ```

2. **Install dependencies:**

    Navigate to the `services` directory and install the Node.js dependencies using `pnpm`.

    ```bash
    cd services
    pnpm install
    ```

3. **Set up environment variables:**

    Create a `.env` file inside the `services/src` directory. You can copy the example file to start.

    ```bash
    cp services/src/.env.example services/src/.env
    ```

    The default values in `.env.example` are configured to work with the Dockerized databases.

4. **Run database migrations:**

    Apply the latest database schema.

    ```bash
    cd services
    pnpm run migration:run
    ```

5. **Start the application:**

    Run the development server.

    ```bash
    cd services
    pnpm run start:dev
    ```

The CMS will be running on `http://localhost:3000` by default (note the port difference from the Docker setup).

### Local DynamoDB Setup

If you are working with features that use DynamoDB, you'll need to start the DynamoDB service and create the necessary tables.

1.  **Start the DynamoDB service:**

    This is already included in the main `docker-compose up` command. If you are running services individually, you can start it with:

    ```bash
    docker-compose up -d dynamodb
    ```

2.  **Create the `publish_table`:**

    Run the following command to set up the table with the correct schema and indexes.

    ```bash
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
      --global-secondary-indexes '[
        {
          "IndexName": "category",
          "KeySchema": [
            {"AttributeName":"categoryId","KeyType":"HASH"},
            {"AttributeName":"publishDate","KeyType":"RANGE"}
          ],
          "Projection":{"ProjectionType":"ALL"}
        },
        {
          "IndexName": "language",
          "KeySchema": [
            {"AttributeName":"language","KeyType":"HASH"},
            {"AttributeName":"publishDate","KeyType":"RANGE"}
          ],
          "Projection":{"ProjectionType":"ALL"}
        },
        {
          "IndexName": "status",
          "KeySchema": [
            {"AttributeName":"status","KeyType":"HASH"},
            {"AttributeName":"publishDate","KeyType":"RANGE"}
          ],
          "Projection":{"ProjectionType":"ALL"}
        }
      ]' \
      --endpoint-url http://localhost:8000
    ```


