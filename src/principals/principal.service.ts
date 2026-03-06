import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { Principal } from './principal.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreatePrincipalDto, UpdatePrincipalDto, SearchPrincipalDto } from './principal.dto';

@Injectable()
export class PrincipalService {
  constructor(private tenantService: TenantService) {}

  async findAll(pagination: PaginationDto, search: SearchPrincipalDto): Promise<PaginatedResult<Principal>> {
    return this.tenantService.withManager(async (manager) => {
      const { page, limit } = pagination;
      const qb = manager.getRepository(Principal).createQueryBuilder('p');

      if (search.name) qb.andWhere('p.name ILIKE :name', { name: `%${search.name}%` });
      if (search.isActive !== undefined) qb.andWhere('p.isActive = :isActive', { isActive: search.isActive });

      const [items, total] = await qb
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('p.name', 'ASC')
        .getManyAndCount();

      return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    });
  }

  async findOne(id: string): Promise<Principal> {
    return this.tenantService.withManager(async (manager) => {
      const p = await manager.getRepository(Principal).findOne({ where: { id } });
      if (!p) throw new NotFoundException('Principal not found');
      return p;
    });
  }

  async create(data: CreatePrincipalDto, userId: string): Promise<Principal> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(Principal).findOne({ where: { name: data.name.toUpperCase() } });
      if (existing) throw new ConflictException(`Principal "${data.name}" already exists`);

      const p = manager.create(Principal, { ...data, name: data.name.toUpperCase(), createdBy: userId });
      try {
        return await manager.save(p);
      } catch (err: any) {
        if (err.code === '23505') throw new ConflictException(`Principal "${data.name}" already exists`);
        throw err;
      }
    });
  }

  async update(id: string, data: UpdatePrincipalDto, userId: string): Promise<Principal> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(Principal).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Principal not found');

      const payload: any = { updatedBy: userId };
      if (data.name) payload.name = data.name.toUpperCase();
      if (data.isActive !== undefined) payload.isActive = data.isActive;

      await manager.getRepository(Principal).update(id, payload);
      return manager.getRepository(Principal).findOne({ where: { id } }) as Promise<Principal>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(Principal).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Principal not found');
      await manager.getRepository(Principal).softDelete(id);
    });
  }
}
