import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLog } from './email-log.entity';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmailLog])],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
