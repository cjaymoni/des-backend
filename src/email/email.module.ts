import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  imports: [TenantModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
