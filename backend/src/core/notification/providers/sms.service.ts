import { Injectable } from '@nestjs/common';
import { INotification } from '../notification.service';

@Injectable()
export class SmsService {
  async sendSms(notification: INotification) {
    // TODO: integrate with your SMS provider (Twilio, AWS SNS, etc.)
    console.log(
      `[SMS] To: ${notification.to}, Message: ${notification.message}`,
    );
    return true;
  }
}
