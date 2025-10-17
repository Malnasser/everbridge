import { Injectable } from '@nestjs/common';
import { INotification } from '../notification.service';

@Injectable()
export class EmailService {
  async sendEmail(notification: INotification) {
    // TODO: integrate with your email service (SES, SendGrid, etc.)
    console.log(
      `[Email] To: ${notification.to}, Subject: ${notification.subject}, Message: ${notification.message}`,
    );
    return true;
  }
}
