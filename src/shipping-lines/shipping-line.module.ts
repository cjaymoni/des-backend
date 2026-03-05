import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { ShippingLineService } from './shipping-line.service';
import { ShippingLineController } from './shipping-line.controller';

@Module({
  imports: [TenantModule],
  providers: [ShippingLineService],
  controllers: [ShippingLineController],
  exports: [ShippingLineService],
})
export class ShippingLineModule {}
