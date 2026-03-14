import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import {
  TransactionPurposeService,
  TransactionPurposeDetailService,
} from './transaction-purpose.service';
import {
  TransactionPurposeController,
  TransactionPurposeDetailController,
} from './transaction-purpose.controller';

@Module({
  imports: [TenantModule],
  providers: [TransactionPurposeService, TransactionPurposeDetailService],
  controllers: [
    TransactionPurposeController,
    TransactionPurposeDetailController,
  ],
})
export class TransactionPurposeModule {}
