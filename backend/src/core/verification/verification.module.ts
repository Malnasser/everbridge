import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { OtpService } from './otp/otp.service';
import { NotificationModule } from '@core/notification/notification.module';
import { CacheModule } from '@common/cache';

@Module({
  imports: [NotificationModule, CacheModule],
  providers: [VerificationService, OtpService],
  exports: [VerificationService],
})
export class VerificationModule {}
