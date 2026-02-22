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
import { Between } from 'typeorm';

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
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const manager = await this.tenantService.getEntityManager();

    const queryBuilder = manager
      .getRepository(HouseManifest)
      .createQueryBuilder('house');

    if (search.hblNo)
      queryBuilder.andWhere('house.hblNo = :hblNo', { hblNo: search.hblNo });
    if (search.consignee)
      queryBuilder.andWhere('house.consignee = :consignee', {
        consignee: search.consignee,
      });
    if (search.masterManifestId)
      queryBuilder.andWhere('house.masterManifestId = :masterManifestId', {
        masterManifestId: search.masterManifestId,
      });

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('house.createdAt', 'DESC')
      .getManyAndCount();

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<HouseManifest> {
    const manager = await this.tenantService.getEntityManager();
    const manifest = await manager
      .getRepository(HouseManifest)
      .createQueryBuilder('house')
      .leftJoinAndSelect('house.masterManifest', 'master')
      .where('house.id = :id', { id })
      .getOne();
    if (!manifest) throw new NotFoundException('House manifest not found');
    return manifest;
  }

  async create(
    data: CreateHouseManifestDto,
    userId: string,
  ): Promise<HouseManifest> {
    const manager = await this.tenantService.getEntityManager();
    await this.masterManifestService.findOne(data.masterManifestId);

    let handCharge = data.handCharge || 0;
    if (!data.handCharge && data.weight) {
      handCharge = await this.calculateCharge(data.weight);
    }

    const manifest = manager.create(HouseManifest, {
      ...data,
      handCharge,
      createdBy: userId,
    });
    return manager.save(manifest);
  }

  async update(
    id: string,
    data: UpdateHouseManifestDto,
    userId: string,
  ): Promise<HouseManifest> {
    const manager = await this.tenantService.getEntityManager();
    await this.findOne(id);

    let handCharge = data.handCharge;
    if (data.weight && !data.handCharge) {
      handCharge = await this.calculateCharge(data.weight);
    }

    await manager
      .getRepository(HouseManifest)
      .createQueryBuilder()
      .update()
      .set({ ...data, handCharge, updatedBy: userId })
      .where('id = :id', { id })
      .execute();

    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const manager = await this.tenantService.getEntityManager();
    await this.findOne(id);
    await manager.getRepository(HouseManifest).softDelete(id);
  }

  async addAttachments(
    id: string,
    attachments: { url: string; publicId: string; filename: string }[],
    userId: string,
  ): Promise<HouseManifest> {
    const manager = await this.tenantService.getEntityManager();
    const manifest = await this.findOne(id);

    const currentAttachments = manifest.attachments || [];
    const updatedAttachments = [...currentAttachments, ...attachments];

    await manager.getRepository(HouseManifest).update(id, {
      attachments: updatedAttachments,
      updatedBy: userId,
    });

    return this.findOne(id);
  }

  async removeAttachment(
    id: string,
    publicId: string,
    userId: string,
  ): Promise<HouseManifest> {
    const manager = await this.tenantService.getEntityManager();
    const manifest = await this.findOne(id);

    const updatedAttachments = (manifest.attachments || []).filter(
      (a) => a.publicId !== publicId,
    );

    await manager.getRepository(HouseManifest).update(id, {
      attachments: updatedAttachments,
      updatedBy: userId,
    });

    return this.findOne(id);
  }

  private async calculateCharge(weight: number): Promise<number> {
    const manager = await this.tenantService.getEntityManager();
    const charge = await manager.findOne(WeightCharge, {
      where: {
        weightFrom: Between(0, weight),
        weightTo: Between(weight, 999999),
      },
    });
    return charge?.charges || 0;
  }
}
