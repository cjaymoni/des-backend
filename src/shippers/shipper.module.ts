import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { ShipperService } from './shipper.service';
import { ShipperController } from './shipper.controller';

@Module({
  imports: [TenantModule],
  providers: [ShipperService],
  controllers: [ShipperController],
  exports: [ShipperService],
})
export class ShipperModule {}
