import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  ) {}

  async getEntityManager(): Promise<EntityManager> {
    const subdomain = this.tenantContext.getTenant();

    // Validate company exists
    const company = await this.companyRepo.findOne({
      where: { appSubdomain: subdomain },
    });
    if (!company)
      throw new NotFoundException(
        `Company with subdomain '${subdomain}' not found`,
      );

    const schemaName = `tenant_${subdomain}`;
    await this.dataSource.query(`SET search_path TO "${schemaName}"`);
    return this.dataSource.manager;
  }

  async validateTenant(subdomain: string): Promise<Company> {
    const company = await this.companyRepo.findOne({
      where: { appSubdomain: subdomain },
    });
    if (!company)
      throw new NotFoundException(
        `Company with subdomain '${subdomain}' not found`,
      );
    return company;
  }
}
