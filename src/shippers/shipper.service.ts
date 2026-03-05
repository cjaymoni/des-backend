import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { Shipper } from './shipper.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateShipperDto, UpdateShipperDto, SearchShipperDto } from './shipper.dto';

@Injectable()
export class ShipperService {
  constructor(private tenantService: TenantService) {}

  async findAll(pagination: PaginationDto, search: SearchShipperDto): Promise<PaginatedResult<Shipper>> {
    return this.tenantService.withManager(async (manager) => {
      const { page, limit } = pagination;
      const qb = manager.getRepository(Shipper).createQueryBuilder('s');

      if (search.name) qb.andWhere('s.name ILIKE :name', { name: `%${search.name}%` });

      const [items, total] = await qb
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('s.name', 'ASC')
        .getManyAndCount();

      return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    });
  }

  async findOne(id: string): Promise<Shipper> {
    return this.tenantService.withManager(async (manager) => {
      const s = await manager.getRepository(Shipper).findOne({ where: { id } });
      if (!s) throw new NotFoundException('Shipper not found');
      return s;
    });
  }

  async create(data: CreateShipperDto, userId: string): Promise<Shipper> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(Shipper).findOne({ where: { name: data.name.toUpperCase() } });
      if (existing) throw new ConflictException(`Shipper "${data.name}" already exists`);

      const s = manager.create(Shipper, { name: data.name.toUpperCase(), createdBy: userId });
      try {
        return await manager.save(s);
      } catch (err: any) {
        if (err.code === '23505') throw new ConflictException(`Shipper "${data.name}" already exists`);
        throw err;
      }
    });
  }

  async update(id: string, data: UpdateShipperDto, userId: string): Promise<Shipper> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(Shipper).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Shipper not found');

      const updateData = data.name ? { name: data.name.toUpperCase(), updatedBy: userId } : { updatedBy: userId };
      await manager.getRepository(Shipper).update(id, updateData);
      return manager.getRepository(Shipper).findOne({ where: { id } }) as Promise<Shipper>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(Shipper).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Shipper not found');
      await manager.getRepository(Shipper).softDelete(id);
    });
  }
}
