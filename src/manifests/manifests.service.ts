import { Injectable } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { Manifest } from './manifest.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class ManifestsService {
  constructor(private tenantService: TenantService) {}

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<Manifest>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const manager = await this.tenantService.getEntityManager();
    const [items, total] = await manager.findAndCount(Manifest, { skip, take: limit });
    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const manager = await this.tenantService.getEntityManager();
    return manager.findOne(Manifest, { where: { id } });
  }

  async create(data: Partial<Manifest>) {
    const manager = await this.tenantService.getEntityManager();
    const manifest = manager.create(Manifest, data);
    return manager.save(manifest);
  }

  async update(id: string, data: Partial<Manifest>) {
    const manager = await this.tenantService.getEntityManager();
    await manager.update(Manifest, id, data);
    return this.findOne(id);
  }

  async delete(id: string) {
    const manager = await this.tenantService.getEntityManager();
    await manager.delete(Manifest, id);
  }
}
