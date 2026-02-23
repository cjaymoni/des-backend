import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { ManifestJobService } from './manifest-job.service';
import { ManifestJobController } from './manifest-job.controller';

@Module({
  imports: [TenantModule],
  providers: [ManifestJobService],
  controllers: [ManifestJobController],
  exports: [ManifestJobService],
})
export class ManifestJobModule {}
