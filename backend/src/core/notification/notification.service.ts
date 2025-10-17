import { Injectable } from '@nestjs/common';
import { EmailService } from './providers/email.service';
import { SmsService } from './providers/sms.service';

export interface INotification {
  to: string; // email or phone
  subject?: string; // for email
  message: string; // main message body
}

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  async sendEmail(notification: INotification) {
    return this.emailService.sendEmail(notification);
  }

  async sendSms(notification: INotification) {
    return this.smsService.sendSms(notification);
  }

  async sendNotification(
    identifier: string,
    message: string,
    subject?: string,
  ) {
    if (this.isEmail(identifier)) {
      return this.sendEmail({ to: identifier, subject, message });
    } else {
      return this.sendSms({ to: identifier, message });
    }
  }

  private isEmail(identifier: string) {
    return identifier.includes('@');
  }
}
