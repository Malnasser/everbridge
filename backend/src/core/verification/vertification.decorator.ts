import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { VerificationGuard } from './verification.guard';

export function UseVerificationGuard(action: string = 'generic') {
  return applyDecorators(
    UseGuards(VerificationGuard),
    SetMetadata('action', action),
    ApiHeader({
      name: 'x-otp-token',
      description: `OTP token for ${action} verification`,
      required: false,
    }),
  );
}
