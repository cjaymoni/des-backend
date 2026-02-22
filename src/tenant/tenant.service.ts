import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { TenantContext } from './tenant.context';
import { Company } from '../companies/company.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    private readonly dataSource: DataSource,
    private readonly tenantContext: TenantContext,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Runs a callback with a fresh tenant-scoped EntityManager.
   * The QueryRunner is always released after the callback, ensuring no connection leaks.
   */
  async withManager<T>(
    callback: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const subdomain = this.tenantContext.getTenant();

    const cacheKey = `company:${subdomain}`;
    let company = await this.cacheManager.get<Company>(cacheKey);
    if (!company) {
      const found = await this.companyRepo.findOne({
        where: { appSubdomain: subdomain },
      });
      if (!found)
        throw new NotFoundException(
          `Company with subdomain '${subdomain}' not found`,
        );
      company = found;
      await this.cacheManager.set(cacheKey, company);
    }

    const schemaName = `tenant_${subdomain}`;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`SET search_path TO "${schemaName}"`);
    try {
      return await callback(queryRunner.manager);
    } finally {
      await queryRunner.release();
    }
  }

  /** @deprecated Use withManager instead */
  async getEntityManager(): Promise<EntityManager> {
    const subdomain = this.tenantContext.getTenant();
    const cacheKey = `company:${subdomain}`;
    let company = await this.cacheManager.get<Company>(cacheKey);
    if (!company) {
      const found = await this.companyRepo.findOne({
        where: { appSubdomain: subdomain },
      });
      if (!found)
        throw new NotFoundException(
          `Company with subdomain '${subdomain}' not found`,
        );
      company = found;
      await this.cacheManager.set(cacheKey, company);
    }
    const schemaName = `tenant_${subdomain}`;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`SET search_path TO "${schemaName}"`);
    return queryRunner.manager;
  }

  async validateTenant(subdomain: string): Promise<Company> {
    const cacheKey = `company:${subdomain}`;
    let company = await this.cacheManager.get<Company>(cacheKey);
    if (!company) {
      const found = await this.companyRepo.findOne({
        where: { appSubdomain: subdomain },
      });
      if (!found)
        throw new NotFoundException(
          `Company with subdomain '${subdomain}' not found`,
        );
      company = found;
      await this.cacheManager.set(cacheKey, company);
    }
    return company;
  }

  async clearCache(subdomain?: string) {
    if (subdomain) {
      await this.cacheManager.del(`company:${subdomain}`);
    } else {
      // cache-manager v5 does not expose reset(); deletion must be per-key
      // Callers should pass a subdomain for targeted invalidation
    }
  }
}
