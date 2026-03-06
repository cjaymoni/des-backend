import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { PrincipalService } from './principal.service';
import { PrincipalController } from './principal.controller';

@Module({
  imports: [TenantModule],
  providers: [PrincipalService],
  controllers: [PrincipalController],
  exports: [PrincipalService],
})
export class PrincipalModule {}
