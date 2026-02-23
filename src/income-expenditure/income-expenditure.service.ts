import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { IncomeExpenditure } from './income-expenditure.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import {
  CreateIncomeExpenditureDto,
  UpdateIncomeExpenditureDto,
  SearchIncomeExpenditureDto,
} from './income-expenditure.dto';

@Injectable()
export class IncomeExpenditureService {
  constructor(private tenantService: TenantService) {}

  async findAll(
    pagination: PaginationDto,
    search: SearchIncomeExpenditureDto,
  ): Promise<PaginatedResult<IncomeExpenditure>> {
    return this.tenantService.withManager(async (manager) => {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      const qb = manager
        .getRepository(IncomeExpenditure)
        .createQueryBuilder('ie');

      if (search.transRemarks) qb.andWhere('ie.transRemarks = :transRemarks', { transRemarks: search.transRemarks });
      if (search.transType) qb.andWhere('ie.transType = :transType', { transType: search.transType });
      if (search.consignee) qb.andWhere('ie.consignee ILIKE :consignee', { consignee: `%${search.consignee}%` });
      if (search.hbl) qb.andWhere('ie.hbl = :hbl', { hbl: search.hbl });
      if (search.strMonth) qb.andWhere('ie.strMonth = :strMonth', { strMonth: search.strMonth });
      if (search.dateYear) qb.andWhere('ie.dateYear = :dateYear', { dateYear: search.dateYear });

      const [items, total] = await qb
        .skip(skip)
        .take(limit)
        .orderBy('ie.transactionDate', 'DESC')
        .getManyAndCount();

      return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    });
  }

  async findOne(id: string): Promise<IncomeExpenditure> {
    return this.tenantService.withManager(async (manager) => {
      const record = await manager.getRepository(IncomeExpenditure).findOne({ where: { id } });
      if (!record) throw new NotFoundException('Income/Expenditure record not found');
      return record;
    });
  }

  async create(data: CreateIncomeExpenditureDto, userId: string): Promise<IncomeExpenditure> {
    return this.tenantService.withManager(async (manager) => {
      const record = manager.create(IncomeExpenditure, { ...data, createdBy: userId });
      return manager.save(record);
    });
  }

  async update(id: string, data: UpdateIncomeExpenditureDto, userId: string): Promise<IncomeExpenditure> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(IncomeExpenditure).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Income/Expenditure record not found');

      const payload = Object.fromEntries(
        Object.entries({ ...data, updatedBy: userId }).filter(([, v]) => v !== undefined),
      );
      await manager.getRepository(IncomeExpenditure).update(id, payload);
      return manager.getRepository(IncomeExpenditure).findOne({ where: { id } }) as Promise<IncomeExpenditure>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(IncomeExpenditure).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Income/Expenditure record not found');
      await manager.getRepository(IncomeExpenditure).softDelete(id);
    });
  }
}
