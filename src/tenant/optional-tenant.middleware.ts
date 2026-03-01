import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './tenant.context';

@Injectable()
export class OptionalTenantMiddleware implements NestMiddleware {
  private static readonly SAFE_SUBDOMAIN = /^[a-z0-9][a-z0-9_-]{0,62}$/i;

  constructor(private readonly tenantContext: TenantContext) {}

  use(req: Request, res: Response, next: NextFunction) {
    const orgName = req.headers['x-org-name'] as string;

    if (orgName && orgName !== 'system') {
      if (!OptionalTenantMiddleware.SAFE_SUBDOMAIN.test(orgName)) {
        throw new BadRequestException('Invalid organization name format');
      }
      this.tenantContext.setTenant(orgName);
    }

    next();
  }
}
