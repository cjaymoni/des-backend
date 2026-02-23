import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { Job } from './job.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateJobDto, UpdateJobDto, SearchJobDto } from './job.dto';

@Injectable()
export class JobService {
  constructor(private tenantService: TenantService) {}

  async findAll(pagination: PaginationDto, search: SearchJobDto): Promise<PaginatedResult<Job>> {
    return this.tenantService.withManager(async (manager) => {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      const qb = manager.getRepository(Job).createQueryBuilder('j');

      if (search.jobNo) qb.andWhere('j.jobNo ILIKE :jobNo', { jobNo: `%${search.jobNo}%` });
      if (search.ie) qb.andWhere('j.ie ILIKE :ie', { ie: `%${search.ie}%` });
      if (search.custRefNo) qb.andWhere('j.custRefNo = :custRefNo', { custRefNo: search.custRefNo });
      if (search.blNo) qb.andWhere('j.blNo = :blNo', { blNo: search.blNo });
      if (search.gcnetJob) qb.andWhere('j.gcnetJob ILIKE :gcnetJob', { gcnetJob: `%${search.gcnetJob}%` });
      if (search.strMonth) qb.andWhere('j.strMonth = :strMonth', { strMonth: search.strMonth });
      if (search.strYear) qb.andWhere('j.strYear = :strYear', { strYear: search.strYear });
      if (search.paidStatus !== undefined) qb.andWhere('j.paidStatus = :paidStatus', { paidStatus: search.paidStatus });

      const [items, total] = await qb
        .skip(skip).take(limit)
        .orderBy('j.fileDate', 'DESC')
        .getManyAndCount();

      return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    });
  }

  async findOne(id: string): Promise<Job> {
    return this.tenantService.withManager(async (manager) => {
      const job = await manager.getRepository(Job).findOne({ where: { id } });
      if (!job) throw new NotFoundException('Job not found');
      return job;
    });
  }

  async create(data: CreateJobDto, userId: string): Promise<Job> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(Job).findOne({ where: { jobNo: data.jobNo } });
      if (existing) throw new ConflictException(`Job number "${data.jobNo}" already exists`);

      const job = manager.create(Job, { ...data, createdBy: userId });
      return manager.save(job);
    });
  }

  async update(id: string, data: UpdateJobDto, userId: string): Promise<Job> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(Job).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Job not found');

      const payload = Object.fromEntries(
        Object.entries({ ...data, updatedBy: userId }).filter(([, v]) => v !== undefined),
      );
      await manager.getRepository(Job).update(id, payload);
      return manager.getRepository(Job).findOne({ where: { id } }) as Promise<Job>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(Job).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Job not found');
      await manager.getRepository(Job).softDelete(id);
    });
  }
}
