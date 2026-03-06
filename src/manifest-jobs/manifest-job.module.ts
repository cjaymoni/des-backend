import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { ManifestJobService } from './manifest-job.service';
import { ManifestJobController } from './manifest-job.controller';
import { HandlingChargeEngine } from './handling-charge.engine';
import { PrincipalChargeModule } from '../principal-charges/principal-charge.module';

@Module({
  imports: [TenantModule, PrincipalChargeModule],
  providers: [ManifestJobService, HandlingChargeEngine],
  controllers: [ManifestJobController],
  exports: [ManifestJobService],
})
export class ManifestJobModule {}
