import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { VerificationModule } from './verification/verification.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AuthModule, VerificationModule, NotificationModule],
  exports: [AuthModule],
})
export class CoreModule {}
