import { Injectable } from '@nestjs/common';
import { INotification } from '../notification.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const emailConfig = this.configService.get('app.email');
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: false, // true for 465, false for other ports
    });
  }

  async sendEmail(notification: INotification) {
    const emailConfig = this.configService.get('app.email');
    await this.transporter.sendMail({
      from: emailConfig.from,
      to: notification.to,
      subject: notification.subject,
      text: notification.message,
    });
    return true;
  }
}
