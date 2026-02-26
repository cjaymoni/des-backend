import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './tenant.context';

@Injectable()
export class OptionalTenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantContext: TenantContext) {}

  use(req: Request, res: Response, next: NextFunction) {
    const orgName = req.headers['x-org-name'] as string;

    if (orgName && orgName !== 'system') {
      this.tenantContext.setTenant(orgName);
    }

    next();
  }
}
