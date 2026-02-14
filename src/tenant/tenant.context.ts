import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  private tenantId: string;

  setTenant(tenantId: string) {
    this.tenantId = tenantId;
  }

  getTenant(): string {
    return this.tenantId;
  }
}
