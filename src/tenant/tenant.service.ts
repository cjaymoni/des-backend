import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { TenantContext } from './tenant.context';
import { Company } from '../companies/company.entity';

@Injectable()
export class TenantService {
  private queryRunnerCache = new Map<string, EntityManager>();

  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    private readonly dataSource: DataSource,
    private readonly tenantContext: TenantContext,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getEntityManager(): Promise<EntityManager> {
    const subdomain = this.tenantContext.getTenant();

    // Check manager cache
    if (this.queryRunnerCache.has(subdomain)) {
      return this.queryRunnerCache.get(subdomain)!;
    }

    // Validate company exists (cached)
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
    await queryRunner.query(`SET search_path TO "${schemaName}"`);
    const manager = queryRunner.manager;
    this.queryRunnerCache.set(subdomain, manager);
    return manager;
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
      this.queryRunnerCache.delete(subdomain);
    } else {
      this.queryRunnerCache.clear();
    }
  }
}
