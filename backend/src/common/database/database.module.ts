import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Organization, User } from 'platform';
import { Invitation } from '@platform/invitations/entities/Invitation.entity';
import {
  OnboardingApplication,
  OnboardingApplicationHistory,
} from '@platform/onboarding/entities';

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
          OnboardingApplicationHistory,
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
