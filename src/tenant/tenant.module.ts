import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { TenantContext } from './tenant.context';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { Company } from '../companies/company.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Company]), ClsModule],
  providers: [TenantContext, TenantService],
  controllers: [TenantController],
  exports: [TenantContext, TenantService],
})
export class TenantModule {}
