import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantService } from '../../tenant/tenant.service';
import { HouseManifest } from '../entities/house-manifest.entity';
import { WeightCharge } from '../entities/weight-charge.entity';
import {
  PaginationDto,
  PaginatedResult,
} from '../../common/dto/pagination.dto';
import {
  CreateHouseManifestDto,
  UpdateHouseManifestDto,
  SearchHouseManifestDto,
} from '../dto/house/house-manifest.dto';
import { MasterManifestService } from './master-manifest.service';
import { Between, EntityManager } from 'typeorm';

@Injectable()
export class HouseManifestService {
  constructor(
    private tenantService: TenantService,
    private masterManifestService: MasterManifestService,
  ) {}

  async findAll(
    pagination: PaginationDto,
    search: SearchHouseManifestDto,
  ): Promise<PaginatedResult<HouseManifest>> {
    return this.tenantService.withManager(async (manager) => {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      const qb = manager
        .getRepository(HouseManifest)
        .createQueryBuilder('house');
      if (search.hblNo)
        qb.andWhere('house.hblNo = :hblNo', { hblNo: search.hblNo });
      if (search.consignee)
        qb.andWhere('house.consignee = :consignee', {
          consignee: search.consignee,
        });
      if (search.masterManifestId)
        qb.andWhere('house.masterManifestId = :masterManifestId', {
          masterManifestId: search.masterManifestId,
        });
      const [items, total] = await qb
        .skip(skip)
        .take(limit)
        .orderBy('house.createdAt', 'DESC')
        .getManyAndCount();
      return {
        items,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    });
  }

  async findOne(id: string): Promise<HouseManifest> {
    return this.tenantService.withManager((manager) =>
      this.fetchOne(manager, id),
    );
  }

  async create(
    data: CreateHouseManifestDto,
    userId: string,
  ): Promise<HouseManifest> {
    await this.masterManifestService.findOne(data.masterManifestId);
    return this.tenantService.withManager(async (manager) => {
      let handCharge = data.handCharge || 0;
      if (!data.handCharge && data.weight) {
        handCharge = await this.calculateCharge(manager, data.weight);
      }
      const manifest = manager.create(HouseManifest, {
        ...data,
        handCharge,
        createdBy: userId,
      });
      return manager.save(manifest);
    });
  }

  async update(
    id: string,
    data: UpdateHouseManifestDto,
    userId: string,
  ): Promise<HouseManifest> {
    return this.tenantService.withManager(async (manager) => {
      // Existence check
      const existing = await manager
        .getRepository(HouseManifest)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('House manifest not found');

      let handCharge = data.handCharge;
      if (data.weight && !data.handCharge) {
        handCharge = await this.calculateCharge(manager, data.weight);
      }

      const payload = Object.fromEntries(
        Object.entries({ ...data, handCharge, updatedBy: userId }).filter(
          ([, v]) => v !== undefined,
        ),
      );
      await manager.getRepository(HouseManifest).update(id, payload);

      // Re-fetch on the same connection — sees the committed update
      return this.fetchOne(manager, id);
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager
        .getRepository(HouseManifest)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('House manifest not found');
      await manager.getRepository(HouseManifest).softDelete(id);
    });
  }

  async addAttachments(
    id: string,
    attachments: { url: string; publicId: string; filename: string }[],
    userId: string,
  ): Promise<HouseManifest> {
    return this.tenantService.withManager(async (manager) => {
      // Lock the row to prevent concurrent attachment modifications
      const manifest = await manager
        .getRepository(HouseManifest)
        .createQueryBuilder('hm')
        .setLock('pessimistic_write')
        .where('hm.id = :id', { id })
        .getOne();
      if (!manifest) throw new NotFoundException('House manifest not found');
      const updatedAttachments = [
        ...(manifest.attachments || []),
        ...attachments,
      ];
      await manager
        .getRepository(HouseManifest)
        .update(id, { attachments: updatedAttachments, updatedBy: userId });
      return this.fetchOne(manager, id);
    });
  }

  async removeAttachment(
    id: string,
    publicId: string,
    userId: string,
  ): Promise<HouseManifest> {
    return this.tenantService.withManager(async (manager) => {
      // Lock the row to prevent concurrent attachment modifications
      const manifest = await manager
        .getRepository(HouseManifest)
        .createQueryBuilder('hm')
        .setLock('pessimistic_write')
        .where('hm.id = :id', { id })
        .getOne();
      if (!manifest) throw new NotFoundException('House manifest not found');
      const updatedAttachments = (manifest.attachments || []).filter(
        (a) => a.publicId !== publicId,
      );
      await manager
        .getRepository(HouseManifest)
        .update(id, { attachments: updatedAttachments, updatedBy: userId });
      return this.fetchOne(manager, id);
    });
  }

  /** Re-usable fetch with masterManifest join — uses the caller's manager (same QR). */
  private async fetchOne(
    manager: EntityManager,
    id: string,
  ): Promise<HouseManifest> {
    const manifest = await manager
      .getRepository(HouseManifest)
      .createQueryBuilder('house')
      .leftJoinAndSelect('house.masterManifest', 'master')
      .where('house.id = :id', { id })
      .getOne();
    if (!manifest) throw new NotFoundException('House manifest not found');
    return manifest;
  }

  private async calculateCharge(
    manager: EntityManager,
    weight: number,
  ): Promise<number> {
    const charge = await manager.findOne(WeightCharge, {
      where: {
        weightFrom: Between(0, weight),
        weightTo: Between(weight, 999999),
      },
    });
    return charge?.charges || 0;
  }
}
