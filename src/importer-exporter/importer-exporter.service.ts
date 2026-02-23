import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { ImporterExporter } from './importer-exporter.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import {
  CreateImporterExporterDto,
  UpdateImporterExporterDto,
  SearchImporterExporterDto,
} from './importer-exporter.dto';

@Injectable()
export class ImporterExporterService {
  constructor(private tenantService: TenantService) {}

  async findAll(
    pagination: PaginationDto,
    search: SearchImporterExporterDto,
  ): Promise<PaginatedResult<ImporterExporter>> {
    return this.tenantService.withManager(async (manager) => {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      const qb = manager
        .getRepository(ImporterExporter)
        .createQueryBuilder('ie');

      if (search.ieName)
        qb.andWhere('ie.ieName ILIKE :ieName', { ieName: `%${search.ieName}%` });
      if (search.code)
        qb.andWhere('ie.code = :code', { code: search.code });

      const [items, total] = await qb
        .skip(skip)
        .take(limit)
        .orderBy('ie.ieName', 'ASC')
        .getManyAndCount();

      return {
        items,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    });
  }

  async findOne(id: string): Promise<ImporterExporter> {
    return this.tenantService.withManager(async (manager) => {
      const ie = await manager
        .getRepository(ImporterExporter)
        .findOne({ where: { id } });
      if (!ie) throw new NotFoundException('Importer/Exporter not found');
      return ie;
    });
  }

  async create(data: CreateImporterExporterDto, userId: string): Promise<ImporterExporter> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(ImporterExporter)
        .findOne({ where: { code: data.code } });
      if (existing) throw new ConflictException(`Code "${data.code}" already exists`);

      const ie = manager.create(ImporterExporter, { ...data, createdBy: userId });
      return manager.save(ie);
    });
  }

  async update(id: string, data: UpdateImporterExporterDto, userId: string): Promise<ImporterExporter> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(ImporterExporter)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Importer/Exporter not found');

      await manager
        .getRepository(ImporterExporter)
        .update(id, { ...data, updatedBy: userId });

      return manager.getRepository(ImporterExporter).findOne({ where: { id } }) as Promise<ImporterExporter>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(ImporterExporter)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Importer/Exporter not found');
      await manager.getRepository(ImporterExporter).softDelete(id);
    });
  }
}
