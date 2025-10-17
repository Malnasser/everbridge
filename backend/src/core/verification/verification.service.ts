import { Injectable } from '@nestjs/common';
import { OtpService } from './otp/otp.service';

// this services is the main communicator to verification guard.
// in the future Tenant can set verification policy instead of sms or email defualt
// ex. authorincators app

@Injectable()
export class VerificationService {
  constructor(private otpService: OtpService) {}

  async initiateVerification(user: any, action: string) {
    await this.otpService.sendOtp(user.identifier, action);
  }

  async verifyOtp(user: any, otp: string, action: string) {
    return this.otpService.verifyOtp(user.identifier, otp, action);
  }
}
