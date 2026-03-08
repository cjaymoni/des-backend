import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { JobService, JobTrackingService } from './job.service';
import { JobController, JobTrackingController } from './job.controller';

@Module({
  imports: [TenantModule],
  providers: [JobService, JobTrackingService],
  controllers: [JobController, JobTrackingController],
  exports: [JobService],
})
export class JobsModule {}
