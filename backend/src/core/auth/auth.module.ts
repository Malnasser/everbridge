import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../../platform/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { InternalGuard, OrgJwtGuard } from './guards';

@Module({
  providers: [AuthService, JwtStrategy, OrgJwtGuard, InternalGuard],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get<number>('app.jwt.accessExpiresIn'),
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  exports: [AuthService, OrgJwtGuard],
})
export class AuthModule {}
