import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { JobService } from './job.service';
import { JobController } from './job.controller';

@Module({
  imports: [TenantModule],
  providers: [JobService],
  controllers: [JobController],
  exports: [JobService],
})
export class JobsModule {}
