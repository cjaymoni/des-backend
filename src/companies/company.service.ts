import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Company } from './company.entity';
import { TENANT_SCHEMA_SQL } from '../config/tenant-schema.sql';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    private dataSource: DataSource,
    private tenantService: TenantService,
  ) {}

  async create(data: Partial<Company>): Promise<Company> {
    const exists = await this.companyRepo.findOne({
      where: { appSubdomain: data.appSubdomain },
    });
    if (exists) throw new ConflictException('Company subdomain already exists');

    const company = this.companyRepo.create(data);
    await this.companyRepo.save(company);

    // Create tenant schema
    await this.createTenantSchema(company.appSubdomain);

    return company;
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<Company>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const [items, total] = await this.companyRepo.findAndCount({ skip, take: limit });
    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findBySubdomain(subdomain: string): Promise<Company> {
    const company = await this.companyRepo.findOne({
      where: { appSubdomain: subdomain },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findBySubdomainPublic(subdomain: string) {
    const company = await this.companyRepo.findOne({
      where: { appSubdomain: subdomain },
      select: ['id', 'appSubdomain', 'companyName', 'logo'],
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, data: Partial<Company>): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, data);
    const updated = await this.companyRepo.save(company);
    await this.tenantService.clearCache(company.appSubdomain);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.deleteTenantSchema(company.appSubdomain);
    await this.companyRepo.remove(company);
    await this.tenantService.clearCache(company.appSubdomain);
  }

  private async createTenantSchema(subdomain: string): Promise<void> {
    const schemaName = `tenant_${subdomain}`;
    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    await this.dataSource.query(`SET search_path TO "${schemaName}"`);
    await this.dataSource.query(TENANT_SCHEMA_SQL);
    await this.dataSource.query(`SET search_path TO public`);
  }

  private async deleteTenantSchema(subdomain: string): Promise<void> {
    const schemaName = `tenant_${subdomain}`;
    await this.dataSource.query(
      `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
    );
  }
}
