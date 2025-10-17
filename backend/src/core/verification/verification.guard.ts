import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VerificationService } from './verification.service';

@Injectable()
export class VerificationGuard implements CanActivate {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const otpHeader = request.headers['x-otp-token'];

    const action: string =
      this.reflector.get<string>('action', context.getHandler()) || null;

    if (!action)
      throw new InternalServerErrorException('Action metadata is missing');

    if (otpHeader) {
      await this.verificationService.initiateVerification(user, action);
      throw new UnauthorizedException({
        message: `otp verification required`,
        nextStep: 'verification_initiated',
      });
    }

    if (otpHeader) {
      const verified = await this.verificationService.verifyOtp(
        user,
        otpHeader,
        action,
      );
      if (!verified) {
        throw new UnauthorizedException('Invalid or expired OTP');
      }
    }

    return true;
  }
}
