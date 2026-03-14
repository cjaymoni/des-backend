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
    public readonly tenantContext: TenantContext,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Runs a callback with a fresh tenant-scoped EntityManager.
   * The QueryRunner is always released after the callback, ensuring no connection leaks.
   */
  async withManager<T>(
    callback: (manager: EntityManager) => Promise<T>,
    options: { transactional?: boolean } = { transactional: true },
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
    // Always wrap in a transaction so SET LOCAL search_path is scoped
    // to this unit of work and never leaks back to the connection pool.
    await queryRunner.startTransaction();
    await queryRunner.query(`SET LOCAL search_path TO "${schemaName}"`);
    try {
      const result = await callback(queryRunner.manager);
      if (options.transactional ?? true) {
        await queryRunner.commitTransaction();
      } else {
        await queryRunner.rollbackTransaction(); // read-only: rollback is a clean no-op
      }
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
