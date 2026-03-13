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
    if (!subdomain) throw new Error('Tenant context not set');
    const { id, appSubdomain, companyName, logo } =
      await this.tenantService.validateTenant(subdomain);
    return { id, appSubdomain, companyName, logo };
  }
}
