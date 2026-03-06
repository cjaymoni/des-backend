import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { PrincipalChargeService } from './principal-charge.service';
import { PrincipalChargeController } from './principal-charge.controller';

@Module({
  imports: [TenantModule],
  providers: [PrincipalChargeService],
  controllers: [PrincipalChargeController],
  exports: [PrincipalChargeService],
})
export class PrincipalChargeModule {}
