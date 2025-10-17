import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    S3Service,
    {
      provide: 'IS3Service',
      useClass: S3Service,
    },
  ],
  exports: [S3Service, 'IS3Service'],
})
export class S3Module {}
