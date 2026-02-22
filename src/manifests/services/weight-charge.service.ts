import { Injectable } from '@nestjs/common';
import { TenantService } from '../../tenant/tenant.service';
import { WeightCharge } from '../entities/weight-charge.entity';

@Injectable()
export class WeightChargeService {
  constructor(private tenantService: TenantService) {}

  async findAll(): Promise<WeightCharge[]> {
    return this.tenantService.withManager((manager) =>
      manager.find(WeightCharge, { order: { weightFrom: 'ASC' } }),
    );
  }

  async create(
    weightFrom: number,
    weightTo: number,
    charges: number,
  ): Promise<WeightCharge> {
    return this.tenantService.withManager(async (manager) => {
      const charge = manager.create(WeightCharge, {
        weightFrom,
        weightTo,
        charges,
      });
      return manager.save(charge);
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager((manager) =>
      manager.delete(WeightCharge, id),
    );
  }
}
