import { CacheModule } from '@common/cache';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { S3Module } from './s3';

@Module({
  imports: [CacheModule, ConfigModule, DatabaseModule, S3Module],
  exports: [CacheModule, ConfigModule, DatabaseModule, S3Module],
})
export class CommonModule {}
