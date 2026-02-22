import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { UploadsModule } from '../uploads/uploads.module';
import { MasterManifestService } from './services/master-manifest.service';
import { HouseManifestService } from './services/house-manifest.service';
import { WeightChargeService } from './services/weight-charge.service';
import { MasterManifestController } from './controllers/master-manifest.controller';
import { HouseManifestController } from './controllers/house-manifest.controller';
import { WeightChargeController } from './controllers/weight-charge.controller';
import { HouseManifestAttachmentsController } from './controllers/house-manifest-attachments.controller';

@Module({
  imports: [TenantModule, UploadsModule],
  providers: [MasterManifestService, HouseManifestService, WeightChargeService],
  controllers: [MasterManifestController, HouseManifestController, WeightChargeController, HouseManifestAttachmentsController],
  exports: [MasterManifestService, HouseManifestService, WeightChargeService],
})
export class ManifestsModule {}
