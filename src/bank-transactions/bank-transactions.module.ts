import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { BankTransactionService } from './bank-transaction.service';
import { BankTransactionController } from './bank-transaction.controller';

@Module({
  imports: [TenantModule],
  providers: [BankTransactionService],
  controllers: [BankTransactionController],
  exports: [BankTransactionService],
})
export class BankTransactionsModule {}
