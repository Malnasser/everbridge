import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Organization, User } from 'platform';
import { Invitation } from '@platform/invitations/entities/Invitation.entity';
import { OnboardingApplication } from '@platform/onboarding/entities';
import { Upload } from '@core/uploader';
import {
  HumanTask,
  HumanTaskAuthorization,
  HumanTaskSignal,
  TaskAttachment,
} from '@workflow-engine/human-tasks';
import { Comment } from '@workflow-engine/comments';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('app.database.host'),
        port: configService.get<number>('app.database.port'),
        username: configService.get<string>('app.database.username'),
        password: configService.get<string>('app.database.password'),
        database: configService.get<string>('app.database.name'),
        entities: [
          Organization,
          User,
          Invitation,
          OnboardingApplication,
          Upload,
          HumanTask,
          Comment,
          HumanTaskSignal,
          HumanTaskAuthorization,
          TaskAttachment,
        ],
        migrations: [__dirname + '/../../../migrations/*.ts'], // Adjusted path
        synchronize: false,
        logging: configService.get<string>('app.env') == 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
