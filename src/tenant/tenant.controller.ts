import { Controller, Get } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantContext } from './tenant.context';

@Controller('tenant')
export class TenantController {
  constructor(
    private tenantService: TenantService,
    private tenantContext: TenantContext,
  ) {}

  @Get('current')
  async getCurrentTenant() {
    const subdomain = this.tenantContext.getTenant();
    const company = await this.tenantService.validateTenant(subdomain);
    return company;
  }
}
