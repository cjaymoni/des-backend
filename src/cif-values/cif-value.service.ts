import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { CifSettings } from './cif-settings.entity';
import { CifValue } from './cif-value.entity';
import { Job } from '../jobs/job.entity';
import { UpsertCifSettingsDto, CreateCifValueDto, UpdateCifValueDto } from './cif-value.dto';

@Injectable()
export class CifValueService {
  constructor(private tenantService: TenantService) {}

  // ── Settings (single-row global rates) ────────────────────────────────────

  async getSettings(): Promise<CifSettings | null> {
    return this.tenantService.withManager((manager) =>
      manager.getRepository(CifSettings).findOne({ where: {} }),
    );
  }

  async upsertSettings(data: UpsertCifSettingsDto, userId: string): Promise<CifSettings> {
    return this.tenantService.withManager(async (manager) => {
      const repo = manager.getRepository(CifSettings);
      const existing = await repo.findOne({ where: {} });
      if (existing) {
        await repo.update(existing.id, { ...data, updatedBy: userId });
        return repo.findOne({ where: { id: existing.id } }) as Promise<CifSettings>;
      }
      return repo.save(repo.create({ ...data, updatedBy: userId }));
    });
  }

  // ── CIF Value line items ───────────────────────────────────────────────────

  async findByRefNo(refNo: string): Promise<CifValue[]> {
    return this.tenantService.withManager((manager) =>
      manager.getRepository(CifValue).find({ where: { refNo }, order: { createdAt: 'ASC' } }),
    );
  }

  async findOne(id: string): Promise<CifValue> {
    return this.tenantService.withManager(async (manager) => {
      const item = await manager.getRepository(CifValue).findOne({ where: { id } });
      if (!item) throw new NotFoundException('CIF value not found');
      return item;
    });
  }

  async create(data: CreateCifValueDto, userId: string): Promise<CifValue> {
    return this.tenantService.withManager(async (manager) => {
      const job = await manager.getRepository(Job).findOne({ where: { id: data.jobId } });
      if (!job) throw new BadRequestException(`Job ${data.jobId} not found`);
      const item = manager.create(CifValue, {
        ...data,
        refNo: data.refNo ?? job.jobNo,
        createdBy: userId,
      });
      return manager.save(item);
    });
  }

  async update(id: string, data: UpdateCifValueDto, userId: string): Promise<CifValue> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(CifValue).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('CIF value not found');
      const payload = Object.fromEntries(
        Object.entries({ ...data, updatedBy: userId }).filter(([, v]) => v !== undefined),
      );
      await manager.getRepository(CifValue).update(id, payload);
      return manager.getRepository(CifValue).findOne({ where: { id } }) as Promise<CifValue>;
    });
  }

  async deleteByRefNo(refNo: string): Promise<void> {
    await this.tenantService.withManager((manager) =>
      manager.getRepository(CifValue).softDelete({ refNo }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(CifValue).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('CIF value not found');
      await manager.getRepository(CifValue).softDelete(id);
    });
  }
}
