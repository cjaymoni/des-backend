import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  send(@Body() dto: SendEmailDto) {
    return this.emailService.send({
      to: dto.to,
      subject: dto.subject,
      body: dto.body,
      module: dto.module,
      userId: dto.userId,
    });
  }
}
