import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantService } from '../../tenant/tenant.service';
import { MasterManifest } from '../entities/master-manifest.entity';
import { HouseManifest } from '../entities/house-manifest.entity';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateMasterManifestDto, UpdateMasterManifestDto, SearchMasterManifestDto } from '../dto/master/master-manifest.dto';

@Injectable()
export class MasterManifestService {
  constructor(private tenantService: TenantService) {}

  async findAll(pagination: PaginationDto, search: SearchMasterManifestDto): Promise<PaginatedResult<MasterManifest>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const manager = await this.tenantService.getEntityManager();
    
    const queryBuilder = manager.getRepository(MasterManifest).createQueryBuilder('master');
    
    if (search.blNo) queryBuilder.andWhere('master.blNo = :blNo', { blNo: search.blNo });
    if (search.vessel) queryBuilder.andWhere('master.vessel = :vessel', { vessel: search.vessel });
    if (search.shippingLine) queryBuilder.andWhere('master.shippingLine = :shippingLine', { shippingLine: search.shippingLine });
    if (search.containerNo) queryBuilder.andWhere('master.containerNo = :containerNo', { containerNo: search.containerNo });
    if (search.shipper) queryBuilder.andWhere('master.shipper = :shipper', { shipper: search.shipper });

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('master.createdAt', 'DESC')
      .getManyAndCount();
    
    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<MasterManifest> {
    const manager = await this.tenantService.getEntityManager();
    const manifest = await manager.getRepository(MasterManifest)
      .createQueryBuilder('master')
      .leftJoinAndSelect('master.houseManifests', 'house')
      .where('master.id = :id', { id })
      .getOne();
    if (!manifest) throw new NotFoundException('Master manifest not found');
    return manifest;
  }

  async create(data: CreateMasterManifestDto, userId: string): Promise<MasterManifest> {
    const manager = await this.tenantService.getEntityManager();
    const manifest = manager.create(MasterManifest, { ...data, createdBy: userId });
    return manager.save(manifest);
  }

  async update(id: string, data: UpdateMasterManifestDto, userId: string): Promise<MasterManifest> {
    const manager = await this.tenantService.getEntityManager();
    await this.findOne(id);
    
    await manager.getRepository(MasterManifest).createQueryBuilder()
      .update()
      .set({ ...data, updatedBy: userId })
      .where('id = :id', { id })
      .execute();

    if (data.blNo || data.containerNo || data.vessel) {
      await manager.getRepository(HouseManifest).createQueryBuilder()
        .update()
        .set({ updatedBy: userId })
        .where('masterManifestId = :id', { id })
        .execute();
    }

    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const manager = await this.tenantService.getEntityManager();
    await this.findOne(id);
    await manager.getRepository(HouseManifest).softDelete({ masterManifestId: id });
    await manager.getRepository(MasterManifest).softDelete(id);
  }
}
