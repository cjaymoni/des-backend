import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { WarehouseJob } from './entities/warehouse-job.entity';
import { HouseManifest } from '../manifests/entities/house-manifest.entity';
import { RentCharge } from './entities/rent-charge.entity';
import { IncomeExpenditure } from '../income-expenditure/income-expenditure.entity';
import { RentChargeEngine, RentChargeResult } from './rent-charge.engine';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import {
  CreateWarehouseJobDto,
  UpdateWarehouseJobDto,
  SearchWarehouseJobDto,
} from './warehouse-job.dto';

@Injectable()
export class WarehouseJobService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly rentChargeEngine: RentChargeEngine,
  ) {}

  async findAll(
    pagination: PaginationDto,
    search: SearchWarehouseJobDto,
  ): Promise<PaginatedResult<WarehouseJob>> {
    return this.tenantService.withManager(
      async (m) => {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const qb = m
          .getRepository(WarehouseJob)
          .createQueryBuilder('wj')
          .leftJoinAndSelect('wj.houseManifest', 'house')
          .leftJoinAndSelect('house.masterManifest', 'master');

        if (search.jobNo)
          qb.andWhere('wj.jobNo ILIKE :jobNo', { jobNo: `%${search.jobNo}%` });
        if (search.hblNo)
          qb.andWhere('wj.hblNo ILIKE :hblNo', { hblNo: search.hblNo });
        if (search.consigneeDetails)
          qb.andWhere('wj.consigneeDetails ILIKE :c', {
            c: `%${search.consigneeDetails}%`,
          });
        if (search.houseManifestId)
          qb.andWhere('wj.houseManifestId = :houseManifestId', {
            houseManifestId: search.houseManifestId,
          });
        if (search.paidStatus !== undefined)
          qb.andWhere('wj.paidStatus = :paidStatus', {
            paidStatus: search.paidStatus,
          });

        const [items, total] = await qb
          .skip(skip)
          .take(limit)
          .orderBy('wj.createdAt', 'DESC')
          .getManyAndCount();

        return {
          items,
          meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
      },
      { transactional: false },
    );
  }

  async findOne(id: string): Promise<WarehouseJob> {
    return this.tenantService.withManager((m) => this.fetchOne(m, id), {
      transactional: false,
    });
  }

  /** Returns HBLs available for warehouse processing (readStatusW = true) */
  async findAvailableHbls(search?: string): Promise<HouseManifest[]> {
    return this.tenantService.withManager(
      async (m) => {
        const qb = m
          .getRepository(HouseManifest)
          .createQueryBuilder('h')
          .leftJoinAndSelect('h.masterManifest', 'master')
          .where('h.readStatusW = true');

        if (search)
          qb.andWhere(
            'h.consignee ILIKE :s OR h.hblNo ILIKE :s OR h.description ILIKE :s',
            { s: `%${search}%` },
          );

        return qb.orderBy('h.hblNo', 'ASC').getMany();
      },
      { transactional: false },
    );
  }

  /** Preview rent calculation without persisting */
  async previewRentCharge(
    unstuffDate: Date,
    deliveryDate: Date,
  ): Promise<RentChargeResult> {
    return this.tenantService.withManager(
      async (m) => {
        const brackets = await m
          .getRepository(RentCharge)
          .find({ order: { dayFrom: 'ASC' } });
        return this.rentChargeEngine.compute(
          unstuffDate,
          deliveryDate,
          brackets,
        );
      },
      { transactional: false },
    );
  }

  async create(
    data: CreateWarehouseJobDto,
    userId: string,
  ): Promise<WarehouseJob> {
    return this.tenantService.withManager(async (m) => {
      // Duplicate job number check
      const existing = await m
        .getRepository(WarehouseJob)
        .findOne({ where: { jobNo: data.jobNo } });
      if (existing)
        throw new ConflictException(
          `Job number "${data.jobNo}" already exists`,
        );

      // Validate HBL exists and is available
      const house = await m
        .getRepository(HouseManifest)
        .findOne({ where: { id: data.houseManifestId } });
      if (!house) throw new NotFoundException('House manifest not found');
      if (!house.readStatusW)
        throw new BadRequestException(
          'This HBL has already been processed for warehouse',
        );

      // Compute rent charge from brackets
      const brackets = await m
        .getRepository(RentCharge)
        .find({ order: { dayFrom: 'ASC' } });
      const result = this.rentChargeEngine.compute(
        data.unstuffDate,
        data.deliveryDate,
        brackets,
      );

      // Build job with computed values
      const job = m.create(WarehouseJob, {
        ...data,
        period: result.totalDays,
        rentCharge: result.rentCharge,
        calcStatus: true,
        createdBy: userId,
      });

      const saved = await m.save(job);

      // Mark HBL as processed (VB6: ReadStatusW = ' ')
      await m
        .getRepository(HouseManifest)
        .update(data.houseManifestId, { readStatusW: false });

      return saved;
    });
  }

  async update(
    id: string,
    data: UpdateWarehouseJobDto,
    userId: string,
  ): Promise<WarehouseJob> {
    return this.tenantService.withManager(async (m) => {
      const existing = await this.fetchOne(m, id);

      // If dates changed, recompute rent charge
      let recomputed: Partial<WarehouseJob> = {};
      const unstuffDate = data.unstuffDate ?? existing.unstuffDate;
      const deliveryDate = data.deliveryDate ?? existing.deliveryDate;

      if (
        (data.unstuffDate || data.deliveryDate) &&
        unstuffDate &&
        deliveryDate
      ) {
        const brackets = await m
          .getRepository(RentCharge)
          .find({ order: { dayFrom: 'ASC' } });
        const result = this.rentChargeEngine.compute(
          unstuffDate,
          deliveryDate,
          brackets,
        );
        recomputed = {
          period: result.totalDays,
          rentCharge: result.rentCharge,
          calcStatus: true,
        };
      }

      const payload = Object.fromEntries(
        Object.entries({ ...data, ...recomputed, updatedBy: userId }).filter(
          ([, v]) => v !== undefined,
        ),
      );

      await m.getRepository(WarehouseJob).update(id, payload);
      return this.fetchOne(m, id);
    });
  }

  /**
   * Posts the warehouse job grand total to IncomeExpenditure (VB6: SaveAgencyFeeAsIncome).
   * Upserts based on transRemarks = jobNo.
   */
  async postToIncome(id: string, userId: string): Promise<IncomeExpenditure> {
    return this.tenantService.withManager(async (m) => {
      const job = await this.fetchOne(m, id);

      if (!job.grandTotal || job.grandTotal <= 0)
        throw new BadRequestException(
          'Grand total must be set before posting to income',
        );

      const repo = m.getRepository(IncomeExpenditure);
      let record = await repo.findOne({
        where: { transRemarks: job.jobNo },
      });

      const payload: Partial<IncomeExpenditure> = {
        transRemarks: job.jobNo,
        transType: 'INCOME',
        incomeAmt: job.grandTotal,
        netIncome: job.netRentCharge,
        netIncVat: job.grandTotal - job.netRentCharge,
        hbl: job.hblNo,
        consignee: job.consigneeDetails,
        agentDetails: job.agentName ?? '',
        transactionDate: job.paidDate ?? new Date(),
        vatNhilStatus: job.incvatStatus,
        updatedBy: userId,
      };

      if (!record) {
        record = m.create(IncomeExpenditure, {
          ...payload,
          createdBy: userId,
        });
      } else {
        Object.assign(record, payload);
      }

      return m.save(record);
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (m) => {
      const existing = await this.fetchOne(m, id);

      // Restore HBL availability (VB6: delete also restores ReadStatusW)
      await m
        .getRepository(HouseManifest)
        .update(existing.houseManifestId, { readStatusW: true });

      // Remove linked income record
      await m
        .getRepository(IncomeExpenditure)
        .delete({ transRemarks: existing.jobNo });

      await m.getRepository(WarehouseJob).softDelete(id);
    });
  }

  private async fetchOne(m: any, id: string): Promise<WarehouseJob> {
    const job = await m
      .getRepository(WarehouseJob)
      .createQueryBuilder('wj')
      .leftJoinAndSelect('wj.houseManifest', 'house')
      .leftJoinAndSelect('house.masterManifest', 'master')
      .where('wj.id = :id', { id })
      .getOne();
    if (!job) throw new NotFoundException('Warehouse job not found');
    return job;
  }
}
