import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TenantContext {
  constructor(private readonly cls: ClsService) {}

  setTenant(tenantId: string) {
    this.cls.set('tenantId', tenantId);
  }

  getTenant(): string | undefined {
    return this.cls.get<string>('tenantId');
  }
}
