import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { ManifestJob } from './manifest-job.entity';
import { HouseManifest } from '../manifests/entities/house-manifest.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import {
  CreateManifestJobDto,
  UpdateManifestJobDto,
  SearchManifestJobDto,
} from './manifest-job.dto';

@Injectable()
export class ManifestJobService {
  constructor(private tenantService: TenantService) {}

  async findAll(
    pagination: PaginationDto,
    search: SearchManifestJobDto,
  ): Promise<PaginatedResult<ManifestJob>> {
    return this.tenantService.withManager(async (manager) => {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      const qb = manager
        .getRepository(ManifestJob)
        .createQueryBuilder('mj')
        .leftJoinAndSelect('mj.houseManifest', 'house')
        .leftJoinAndSelect('house.masterManifest', 'master');

      if (search.jobNo)
        qb.andWhere('mj.jobNo ILIKE :jobNo', { jobNo: `%${search.jobNo}%` });
      if (search.hblNo)
        qb.andWhere('mj.hblNo = :hblNo', { hblNo: search.hblNo });
      if (search.consigneeDetails)
        qb.andWhere('mj.consigneeDetails ILIKE :c', {
          c: `%${search.consigneeDetails}%`,
        });
      if (search.custRefNo)
        qb.andWhere('mj.custRefNo = :custRefNo', {
          custRefNo: search.custRefNo,
        });
      if (search.houseManifestId)
        qb.andWhere('mj.houseManifestId = :houseManifestId', {
          houseManifestId: search.houseManifestId,
        });
      if (search.paidStatus !== undefined)
        qb.andWhere('mj.paidStatus = :paidStatus', {
          paidStatus: search.paidStatus,
        });

      const [items, total] = await qb
        .skip(skip)
        .take(limit)
        .orderBy('mj.createdAt', 'DESC')
        .getManyAndCount();

      return {
        items,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    });
  }

  async findOne(id: string): Promise<ManifestJob> {
    return this.tenantService.withManager((manager) =>
      this.fetchOne(manager, id),
    );
  }

  async create(
    data: CreateManifestJobDto,
    userId: string,
  ): Promise<ManifestJob> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(ManifestJob)
        .findOne({ where: { jobNo: data.jobNo } });
      if (existing)
        throw new ConflictException(
          `Job number "${data.jobNo}" already exists`,
        );

      const house = await manager
        .getRepository(HouseManifest)
        .findOne({ where: { id: data.houseManifestId } });
      if (!house) throw new NotFoundException('House manifest not found');

      const job = manager.create(ManifestJob, { ...data, createdBy: userId });
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

  async update(
    id: string,
    data: UpdateManifestJobDto,
    userId: string,
  ): Promise<ManifestJob> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(ManifestJob)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Manifest job not found');

      const payload = Object.fromEntries(
        Object.entries({ ...data, updatedBy: userId }).filter(
          ([, v]) => v !== undefined,
        ),
      );
      await manager.getRepository(ManifestJob).update(id, payload);

      // Mirror releaseStatus + releaseDate back to HouseManifest (VB6 behaviour)
      if (data.releaseStatus !== undefined || data.releaseDate !== undefined) {
        const houseUpdate: Partial<HouseManifest> = {};
        if (data.releaseStatus !== undefined)
          houseUpdate.releaseStatus = data.releaseStatus;
        if (data.releaseDate !== undefined)
          houseUpdate.releaseDate = data.releaseDate;
        await manager
          .getRepository(HouseManifest)
          .update(existing.houseManifestId, houseUpdate);
      }

      return this.fetchOne(manager, id);
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(ManifestJob)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Manifest job not found');
      await manager.getRepository(ManifestJob).softDelete(id);
    });
  }

  private async fetchOne(manager: any, id: string): Promise<ManifestJob> {
    const job = await manager
      .getRepository(ManifestJob)
      .createQueryBuilder('mj')
      .leftJoinAndSelect('mj.houseManifest', 'house')
      .leftJoinAndSelect('house.masterManifest', 'master')
      .where('mj.id = :id', { id })
      .getOne();
    if (!job) throw new NotFoundException('Manifest job not found');
    return job;
  }
}
