import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { TransactionPurposeService } from './transaction-purpose.service';
import { TransactionPurposeController } from './transaction-purpose.controller';

@Module({
  imports: [TenantModule],
  providers: [TransactionPurposeService],
  controllers: [TransactionPurposeController],
})
export class TransactionPurposeModule {}
