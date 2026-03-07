import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { BankTransactionService } from './bank-transaction.service';
import { BankTransactionController } from './bank-transaction.controller';
import { AccountTypeService } from './account-type.service';
import { AccountTypeController } from './account-type.controller';

@Module({
  imports: [TenantModule],
  providers: [BankTransactionService, AccountTypeService],
  controllers: [BankTransactionController, AccountTypeController],
  exports: [BankTransactionService],
})
export class BankTransactionsModule {}
