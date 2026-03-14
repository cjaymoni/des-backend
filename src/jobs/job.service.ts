import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TenantService } from '../tenant/tenant.service';
import { Job } from './job.entity';
import { JobTracking } from './job-tracking.entity';
import { ManifestJob } from '../manifest-jobs/manifest-job.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateJobDto, UpdateJobDto, SearchJobDto } from './job.dto';

@Injectable()
export class JobService {
  constructor(private tenantService: TenantService) {}

  async findAll(
    pagination: PaginationDto,
    search: SearchJobDto,
  ): Promise<PaginatedResult<Job>> {
    return this.tenantService.withManager(
      async (manager) => {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;
        const qb = manager.getRepository(Job).createQueryBuilder('j');

        if (search.jobNo)
          qb.andWhere('j.jobNo ILIKE :jobNo', { jobNo: `%${search.jobNo}%` });
        if (search.ie) qb.andWhere('j.ie ILIKE :ie', { ie: `%${search.ie}%` });
        if (search.custRefNo)
          qb.andWhere('j.custRefNo = :custRefNo', {
            custRefNo: search.custRefNo,
          });
        if (search.blNo) qb.andWhere('j.blNo = :blNo', { blNo: search.blNo });
        if (search.gcnetJob)
          qb.andWhere('j.gcnetJob ILIKE :gcnetJob', {
            gcnetJob: `%${search.gcnetJob}%`,
          });
        if (search.strMonth)
          qb.andWhere('j.strMonth = :strMonth', { strMonth: search.strMonth });
        if (search.strYear)
          qb.andWhere('j.strYear = :strYear', { strYear: search.strYear });
        if (search.paidStatus !== undefined)
          qb.andWhere('j.paidStatus = :paidStatus', {
            paidStatus: search.paidStatus,
          });

        const [items, total] = await qb
          .skip(skip)
          .take(limit)
          .orderBy('j.fileDate', 'DESC')
          .getManyAndCount();

        return {
          items,
          meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
      },
      { transactional: false },
    );
  }

  async findOne(id: string): Promise<Job> {
    return this.tenantService.withManager(
      async (manager) => {
        const job = await manager.getRepository(Job).findOne({ where: { id } });
        if (!job) throw new NotFoundException('Job not found');
        return job;
      },
      { transactional: false },
    );
  }

  async create(data: CreateJobDto, userId: string): Promise<Job> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(Job)
        .findOne({ where: { jobNo: data.jobNo } });
      if (existing)
        throw new ConflictException(
          `Job number "${data.jobNo}" already exists`,
        );

      const job = manager.create(Job, { ...data, createdBy: userId });
      try {
        return await manager.save(job);
      } catch (err: any) {
        if (err.code === '23505')
          throw new ConflictException(
            `Job number "${data.jobNo}" already exists`,
          );
        throw err;
      }
    });
  }

  async update(id: string, data: UpdateJobDto, userId: string): Promise<Job> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(Job)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Job not found');

      const payload = Object.fromEntries(
        Object.entries({ ...data, updatedBy: userId }).filter(
          ([, v]) => v !== undefined,
        ),
      );
      await manager.getRepository(Job).update(id, payload);
      return manager
        .getRepository(Job)
        .findOne({ where: { id } }) as Promise<Job>;
    });
  }

  async nextNumber(
    transType: string,
    a2IdfNo: string,
    finType: string,
  ): Promise<string> {
    return this.tenantService.withManager(
      async (manager) => {
        const year = new Date().getFullYear();
        const trans = transType.slice(0, 3).toUpperCase();
        const idf = a2IdfNo.replace(/\s+/g, '').toUpperCase().slice(0, 10);
        const fin = finType.slice(0, 3).toUpperCase();
        const prefix = `${trans}-${idf}-${fin}-${year}-`;
        const count = await manager
          .getRepository(Job)
          .createQueryBuilder('j')
          .where('j.jobNo LIKE :prefix', { prefix: `${prefix}%` })
          .getCount();
        const seq = String(count + 1).padStart(4, '0');
        return `${prefix}${seq}`;
      },
      { transactional: false },
    );
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(Job)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Job not found');
      await manager.getRepository(Job).softDelete(id);
    });
  }

  private async buildDebitNote(
    manager: any,
    rows: JobTracking[],
    company: any,
  ) {
    const job = rows[0].job;
    const manifestJob = await manager
      .getRepository(ManifestJob)
      .createQueryBuilder('mj')
      .leftJoinAndSelect('mj.houseManifest', 'house')
      .leftJoinAndSelect('house.masterManifest', 'master')
      .where('mj.jobNo = :jobNo', { jobNo: job.jobNo })
      .getOne();
    const grandTotal = rows.reduce(
      (sum, r) => sum + r.transAmount + r.vatAmount,
      0,
    );
    return {
      company,
      job,
      manifestJob: manifestJob ?? null,
      lineItems: rows,
      grandTotal,
    };
  }

  async getDebitNote(jobNo: string) {
    return this.tenantService.withManager(
      async (manager) => {
        const rows = await manager
          .getRepository(JobTracking)
          .createQueryBuilder('jt')
          .innerJoinAndSelect('jt.job', 'j')
          .leftJoinAndSelect('jt.detail', 'd')
          .where('jt.jobNo = :jobNo', { jobNo })
          .orderBy('jt.vatAmount', 'ASC')
          .addOrderBy('d.purposeDetails', 'ASC')
          .getMany();

        if (!rows.length)
          throw new NotFoundException('No debit note records found');

        const company = await this.tenantService.validateTenant(
          this.tenantService.tenantContext.getTenant()!,
        );
        return this.buildDebitNote(manager, rows, company);
      },
      { transactional: false },
    );
  }

  async getAllDebitNotes() {
    return this.tenantService.withManager(
      async (manager) => {
        const rows = await manager
          .getRepository(JobTracking)
          .createQueryBuilder('jt')
          .innerJoinAndSelect('jt.job', 'j')
          .leftJoinAndSelect('jt.detail', 'd')
          .orderBy('jt.jobNo', 'ASC')
          .getMany();

        const company = await this.tenantService.validateTenant(
          this.tenantService.tenantContext.getTenant()!,
        );

        const grouped = new Map<string, JobTracking[]>();
        for (const row of rows) {
          if (!grouped.has(row.jobNo)) grouped.set(row.jobNo, []);
          grouped.get(row.jobNo)!.push(row);
        }

        return Promise.all(
          Array.from(grouped.values()).map((jobRows) =>
            this.buildDebitNote(manager, jobRows, company),
          ),
        );
      },
      { transactional: false },
    );
  }
}

export class CreateJobTrackingDto {
  @IsString() jobNo: string;
  @IsOptional() @IsString() purposeCode?: string;
  @IsOptional() @IsString() detailCode?: string;
  @Type(() => Number) @IsNumber() @Min(0) transAmount: number;
  @Type(() => Number) @IsNumber() @Min(0) vatAmount: number;
  @IsOptional() @IsBoolean() vatStatus?: boolean;
  @IsOptional() @IsString() transBy?: string;
  @IsOptional() @Type(() => Date) @IsDate() transactionDate?: Date;
}

export class UpdateJobTrackingDto {
  @IsOptional() @IsString() purposeCode?: string;
  @IsOptional() @IsString() detailCode?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) transAmount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) vatAmount?: number;
  @IsOptional() @IsBoolean() vatStatus?: boolean;
  @IsOptional() @IsString() transBy?: string;
  @IsOptional() @Type(() => Date) @IsDate() transactionDate?: Date;
}

@Injectable()
export class JobTrackingService {
  constructor(private tenantService: TenantService) {}

  findByJob(jobNo: string): Promise<JobTracking[]> {
    return this.tenantService.withManager((m) =>
      m.getRepository(JobTracking).find({
        where: { jobNo },
        relations: ['detail'],
        order: { transactionDate: 'DESC' },
      }),
    );
  }

  create(data: CreateJobTrackingDto, userId: string): Promise<JobTracking> {
    return this.tenantService.withManager(async (m) => {
      const job = await m
        .getRepository(Job)
        .findOne({ where: { jobNo: data.jobNo } });
      if (!job) throw new NotFoundException(`Job "${data.jobNo}" not found`);
      return m.save(m.create(JobTracking, { ...data, createdBy: userId }));
    });
  }

  update(
    id: string,
    data: UpdateJobTrackingDto,
    userId: string,
  ): Promise<JobTracking> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(JobTracking)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Tracking entry not found');
      await m
        .getRepository(JobTracking)
        .update(id, { ...data, updatedBy: userId });
      return m.getRepository(JobTracking).findOne({
        where: { id },
        relations: ['detail'],
      }) as Promise<JobTracking>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(JobTracking)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Tracking entry not found');
      await m.getRepository(JobTracking).softDelete(id);
    });
  }
}
