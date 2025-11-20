import { Injectable, NotFoundException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { Upload } from './entities/upload.entity';
import { User } from '@platform/users/entities/user.entity';
import { BaseService } from '@common/base';
import { UploaderRepository } from './uploader.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploaderService extends BaseService<Upload> {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly uploadsRepository: UploaderRepository,
  ) {
    super(uploadsRepository, Upload);
    const awsConfig = this.configService.get('app.aws');
    this.s3Client = new S3Client({
      endpoint: awsConfig.endpoint,
      region: awsConfig.region,
      forcePathStyle: awsConfig.forcePathStyle,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
    this.bucket = awsConfig.bucketName;
  }

  async uploadFile(
    file: { buffer: Buffer; originalname: string; mimetype: string },
    owner: User,
  ): Promise<Upload | Error> {
    const key = `uploads/${owner.id}/${uuidv4()}-${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
    } catch (err) {
      return new Error(`Failed to upload file.`);
    }
    const url = `${this.configService.get('app.aws.endpoint')}/${this.bucket}/${key}`;

    return await this.uploadsRepository.create({
      filename: file.originalname,
      key,
      bucket: this.bucket,
      mimetype: file.mimetype,
      size: file.buffer.length,
      url,
      owner,
    });
  }

  async getSignedUrl(uploadId: string): Promise<string | Error> {
    const upload = await this.uploadsRepository.findById(uploadId);
    if (!upload) {
      return new Error(`Upload with ID ${uploadId} not found`);
    }
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: upload.key,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (err) {
      return new Error('Error downloading file.');
    }
  }
}
