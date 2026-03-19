import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-transport';
import { EmailLog } from './email-log.entity';

export interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  module: string;
  userId?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(EmailLog)
    private readonly emailLogRepo: Repository<EmailLog>,
  ) {
    this.transporter = nodemailer.createTransport(<Options>{
      host: this.config.get<string>('SMTP_HOST'),
      port: 587,
      secure: false,
      family: 4,
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
      tls: { ciphers: 'SSLv3' },
    });
  }

  async send(options: SendEmailOptions): Promise<EmailLog> {
    const log = this.emailLogRepo.create({
      recipient: options.to,
      subject: options.subject,
      body: JSON.stringify(options.body),
      module: options.module,
      userId: options.userId,
      status: 'pending',
    });

    await this.emailLogRepo.save(log);

    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('SMTP_FROM'),
        to: options.to,
        subject: options.subject,
        html: options.body,
      });

      log.status = 'sent';
    } catch (err) {
      log.status = 'failed';
      log.error = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to send email to ${options.to}: ${log.error}`);
    }

    return this.emailLogRepo.save(log);
  }
}
