import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './tenant.context';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantContext: TenantContext) {}

  use(req: Request, res: Response, next: NextFunction) {
    const orgName = req.headers['x-org-name'] as string;

    if (!orgName) {
      throw new BadRequestException('Organization name is required');
    }

    this.tenantContext.setTenant(orgName);
    next();
  }
}
