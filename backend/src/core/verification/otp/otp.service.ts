import { CacheService } from '@common/cache';
import { NotificationService } from '@core/notification/notification.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomInt, createHash } from 'crypto';

@Injectable()
export class OtpService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly notificationService: NotificationService,
  ) {}

  async sendOtp(
    identifier: string,
    context: string,
    ttl: number = 300,
  ): Promise<void> {
    const otp = this.generateOtp();
    const hashedOtp = this.hashOtp(otp);
    const redisKey = this.buildKey(identifier, context);

    const exists = await this.cacheService.get(redisKey);
    if (exists) {
      throw new BadRequestException(
        'OTP already sent, please wait before requesting again',
      );
    }

    await this.cacheService.set(redisKey, hashedOtp, ttl);

    if (this.isEmail(identifier)) {
      await this.notificationService.sendEmail({
        to: identifier,
        subject: `Your verification code`,
        message: `Your OTP code is ${otp}. It expires in 5 minutes.`,
      });
    } else {
      await this.notificationService.sendSms({
        to: identifier,
        message: `Your OTP code is ${otp}. It expires in 5 minutes.`,
      });
    }
  }

  async verifyOtp(
    identifier: string,
    otp: string,
    context: string,
    ttl: number = 300,
  ): Promise<boolean> {
    const redisKey = this.buildKey(identifier, context);

    const storedHashedOtp = await this.cacheService.get(redisKey);
    if (!storedHashedOtp) return false;

    const hashedOtp = this.hashOtp(otp);
    const isValid = storedHashedOtp === hashedOtp;

    if (isValid) {
      await this.cacheService.del(redisKey);
      await this.cacheService.set(
        this.buildVerifiedKey(identifier, context),
        'true',
        ttl,
      );
    }

    return isValid;
  }

  async isVerified(identifier: string, context: string): Promise<boolean> {
    const verifiedKey = this.buildVerifiedKey(identifier, context);
    return Boolean(await this.cacheService.get(verifiedKey));
  }

  private generateOtp(): string {
    return String(randomInt(100000, 999999));
  }

  private hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }

  private buildKey(identifier: string, context: string): string {
    return `otp:${context}:${identifier}`;
  }

  private buildVerifiedKey(identifier: string, context: string): string {
    return `otp:verified:${context}:${identifier}`;
  }

  private isEmail(identifier: string): boolean {
    return identifier.includes('@');
  }
}
