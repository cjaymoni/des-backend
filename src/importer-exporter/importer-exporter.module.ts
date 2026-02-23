import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { ImporterExporterService } from './importer-exporter.service';
import { ImporterExporterController } from './importer-exporter.controller';

@Module({
  imports: [TenantModule],
  providers: [ImporterExporterService],
  controllers: [ImporterExporterController],
  exports: [ImporterExporterService],
})
export class ImporterExporterModule {}
