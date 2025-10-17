import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export interface IS3Service {
  getS3Client(): S3Client;
  uploadFile(
    fileStream: any,
    fileName: string,
    mimeType: string,
  ): Promise<Upload>;
}
