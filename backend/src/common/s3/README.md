# S3 Module

This module provides a service for interacting with an S3-compatible object storage service, such as Amazon S3 or MinIO.

## Purpose

The `S3Module` encapsulates the logic for connecting to and uploading files to an S3 bucket. It is used by other services, such as the `MediaService`, to handle file uploads for media assets and posters.

## Core Components

-   **`S3Module`**: This module provides and exports the `S3Service`, making it available for dependency injection in other parts of the application.

-   **`S3Service`**: This service is the core of the module. It performs the following functions:
    -   **Client Initialization**: It creates an `S3Client` from the `@aws-sdk/client-s3` library, configuring it with the region, endpoint, and credentials provided by the `ConfigService`.
    -   **File Upload**: It exposes an `uploadFile` method that takes a file stream, file name, and MIME type. This method uses the `@aws-sdk/lib-storage` `Upload` utility to efficiently handle streaming uploads to the configured S3 bucket.

By abstracting the S3 interaction into this service, other parts of the application can upload files without needing to know the underlying details of the AWS SDK or the S3 configuration.