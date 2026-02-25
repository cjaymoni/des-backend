import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { CifValueService } from './cif-value.service';
import { CifValueController } from './cif-value.controller';

@Module({
  imports: [TenantModule],
  providers: [CifValueService],
  controllers: [CifValueController],
  exports: [CifValueService],
})
export class CifValuesModule {}
