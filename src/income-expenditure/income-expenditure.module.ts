import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { IncomeExpenditureService } from './income-expenditure.service';
import { IncomeExpenditureController } from './income-expenditure.controller';

@Module({
  imports: [TenantModule],
  providers: [IncomeExpenditureService],
  controllers: [IncomeExpenditureController],
  exports: [IncomeExpenditureService],
})
export class IncomeExpenditureModule {}
