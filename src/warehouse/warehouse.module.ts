import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { RentChargeService } from './rent-charge.service';
import { RentChargeController } from './rent-charge.controller';
import { RentChargeEngine } from './rent-charge.engine';
import { WarehouseJobService } from './warehouse-job.service';
import { WarehouseJobController } from './warehouse-job.controller';

@Module({
  imports: [TenantModule],
  providers: [RentChargeService, RentChargeEngine, WarehouseJobService],
  controllers: [RentChargeController, WarehouseJobController],
  exports: [RentChargeService, RentChargeEngine, WarehouseJobService],
})
export class WarehouseModule {}
