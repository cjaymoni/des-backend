import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantService } from '../../tenant/tenant.service';
import { MasterManifest } from '../entities/master-manifest.entity';
import { HouseManifest } from '../entities/house-manifest.entity';
import {
  PaginationDto,
  PaginatedResult,
} from '../../common/dto/pagination.dto';
import {
  CreateMasterManifestDto,
  UpdateMasterManifestDto,
  SearchMasterManifestDto,
} from '../dto/master/master-manifest.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class MasterManifestService {
  constructor(private tenantService: TenantService) {}

  async findAll(
    pagination: PaginationDto,
    search: SearchMasterManifestDto,
  ): Promise<PaginatedResult<MasterManifest>> {
    return this.tenantService.withManager(async (manager) => {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      const qb = manager
        .getRepository(MasterManifest)
        .createQueryBuilder('master');
      if (search.blNo)
        qb.andWhere('master.blNo = :blNo', { blNo: search.blNo });
      if (search.vessel)
        qb.andWhere('master.vessel = :vessel', { vessel: search.vessel });
      if (search.shippingLine)
        qb.andWhere('master.shippingLine = :shippingLine', {
          shippingLine: search.shippingLine,
        });
      if (search.containerNo)
        qb.andWhere('master.containerNo = :containerNo', {
          containerNo: search.containerNo,
        });
      if (search.shipper)
        qb.andWhere('master.shipper = :shipper', { shipper: search.shipper });
      const [items, total] = await qb
        .skip(skip)
        .take(limit)
        .orderBy('master.createdAt', 'DESC')
        .getManyAndCount();
      return {
        items,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    });
  }

  async findOne(id: string): Promise<MasterManifest> {
    return this.tenantService.withManager((manager) =>
      this.fetchOne(manager, id),
    );
  }

  async create(
    data: CreateMasterManifestDto,
    userId: string,
  ): Promise<MasterManifest> {
    return this.tenantService.withManager(async (manager) => {
      const manifest = manager.create(MasterManifest, {
        ...data,
        createdBy: userId,
      });
      return manager.save(manifest);
    });
  }

  async update(
    id: string,
    data: UpdateMasterManifestDto,
    userId: string,
  ): Promise<MasterManifest> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(MasterManifest)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Master manifest not found');

      await manager
        .getRepository(MasterManifest)
        .createQueryBuilder()
        .update()
        .set({ ...data, updatedBy: userId })
        .where('id = :id', { id })
        .execute();

      if (data.blNo || data.containerNo || data.vessel) {
        await manager
          .getRepository(HouseManifest)
          .createQueryBuilder()
          .update()
          .set({ updatedBy: userId })
          .where('masterManifestId = :id', { id })
          .execute();
      }

      return this.fetchOne(manager, id);
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(MasterManifest)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Master manifest not found');
      await manager
        .getRepository(HouseManifest)
        .softDelete({ masterManifestId: id });
      await manager.getRepository(MasterManifest).softDelete(id);
    });
  }

  private async fetchOne(
    manager: EntityManager,
    id: string,
  ): Promise<MasterManifest> {
    const manifest = await manager
      .getRepository(MasterManifest)
      .createQueryBuilder('master')
      .leftJoinAndSelect('master.houseManifests', 'house')
      .where('master.id = :id', { id })
      .getOne();
    if (!manifest) throw new NotFoundException('Master manifest not found');
    return manifest;
  }
}
