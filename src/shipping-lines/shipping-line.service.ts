import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { ShippingLine } from './shipping-line.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import {
  CreateShippingLineDto,
  UpdateShippingLineDto,
  SearchShippingLineDto,
} from './shipping-line.dto';

@Injectable()
export class ShippingLineService {
  constructor(private tenantService: TenantService) {}

  async findAll(
    pagination: PaginationDto,
    search: SearchShippingLineDto,
  ): Promise<PaginatedResult<ShippingLine>> {
    return this.tenantService.withManager(
      async (manager) => {
        const { page, limit } = pagination;
        const qb = manager.getRepository(ShippingLine).createQueryBuilder('sl');

        if (search.name)
          qb.andWhere('sl.name ILIKE :name', { name: `%${search.name}%` });

        const [items, total] = await qb
          .skip((page - 1) * limit)
          .take(limit)
          .orderBy('sl.name', 'ASC')
          .getManyAndCount();

        return {
          items,
          meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
      },
      { transactional: false },
    );
  }

  async findOne(id: string): Promise<ShippingLine> {
    return this.tenantService.withManager(
      async (manager) => {
        const sl = await manager
          .getRepository(ShippingLine)
          .findOne({ where: { id } });
        if (!sl) throw new NotFoundException('Shipping line not found');
        return sl;
      },
      { transactional: false },
    );
  }

  async create(
    data: CreateShippingLineDto,
    userId: string,
  ): Promise<ShippingLine> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(ShippingLine)
        .findOne({ where: { name: data.name.toUpperCase() } });
      if (existing)
        throw new ConflictException(
          `Shipping line "${data.name}" already exists`,
        );

      const sl = manager.create(ShippingLine, {
        name: data.name.toUpperCase(),
        createdBy: userId,
      });
      try {
        return await manager.save(sl);
      } catch (err: any) {
        if (err.code === '23505')
          throw new ConflictException(
            `Shipping line "${data.name}" already exists`,
          );
        throw err;
      }
    });
  }

  async update(
    id: string,
    data: UpdateShippingLineDto,
    userId: string,
  ): Promise<ShippingLine> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(ShippingLine)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Shipping line not found');

      const updateData = data.name
        ? { name: data.name.toUpperCase(), updatedBy: userId }
        : { updatedBy: userId };
      await manager.getRepository(ShippingLine).update(id, updateData);
      return manager
        .getRepository(ShippingLine)
        .findOne({ where: { id } }) as Promise<ShippingLine>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(ShippingLine)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Shipping line not found');
      await manager.getRepository(ShippingLine).softDelete(id);
    });
  }
}
