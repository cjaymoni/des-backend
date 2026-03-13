import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { Currency } from './currency.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import {
  CreateCurrencyDto,
  UpdateCurrencyDto,
  SearchCurrencyDto,
} from './currency.dto';

@Injectable()
export class CurrencyService {
  constructor(private tenantService: TenantService) {}

  async findAll(
    pagination: PaginationDto,
    search: SearchCurrencyDto,
  ): Promise<PaginatedResult<Currency>> {
    return this.tenantService.withManager(
      async (manager) => {
        const { page, limit } = pagination;
        const qb = manager.getRepository(Currency).createQueryBuilder('c');

        if (search.code)
          qb.andWhere('c.code ILIKE :code', { code: `%${search.code}%` });
        if (search.isActive !== undefined)
          qb.andWhere('c.isActive = :isActive', { isActive: search.isActive });

        const [items, total] = await qb
          .skip((page - 1) * limit)
          .take(limit)
          .orderBy('c.code', 'ASC')
          .getManyAndCount();

        return {
          items,
          meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
      },
      { transactional: false },
    );
  }

  async findOne(id: string): Promise<Currency> {
    return this.tenantService.withManager(
      async (manager) => {
        const c = await manager
          .getRepository(Currency)
          .findOne({ where: { id } });
        if (!c) throw new NotFoundException('Currency not found');
        return c;
      },
      { transactional: false },
    );
  }

  async findActiveByCode(code: string, manager: any): Promise<Currency | null> {
    return manager.getRepository(Currency).findOne({
      where: { code: code.toUpperCase(), isActive: true },
    });
  }

  async create(data: CreateCurrencyDto, userId: string): Promise<Currency> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(Currency)
        .findOne({ where: { code: data.code.toUpperCase() } });
      if (existing)
        throw new ConflictException(`Currency "${data.code}" already exists`);

      const c = manager.create(Currency, {
        ...data,
        code: data.code.toUpperCase(),
        createdBy: userId,
      });
      try {
        return await manager.save(c);
      } catch (err: any) {
        if (err.code === '23505')
          throw new ConflictException(`Currency "${data.code}" already exists`);
        throw err;
      }
    });
  }

  async update(
    id: string,
    data: UpdateCurrencyDto,
    userId: string,
  ): Promise<Currency> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(Currency)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Currency not found');

      const payload = Object.fromEntries(
        Object.entries({ ...data, updatedBy: userId }).filter(
          ([, v]) => v !== undefined,
        ),
      );
      await manager.getRepository(Currency).update(id, payload);
      return manager
        .getRepository(Currency)
        .findOne({ where: { id } }) as Promise<Currency>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(Currency)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Currency not found');
      await manager.getRepository(Currency).softDelete(id);
    });
  }
}
