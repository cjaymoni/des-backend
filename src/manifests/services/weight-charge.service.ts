import { Injectable } from '@nestjs/common';
import { TenantService } from '../../tenant/tenant.service';
import { WeightCharge } from '../entities/weight-charge.entity';

@Injectable()
export class WeightChargeService {
  constructor(private tenantService: TenantService) {}

  async findAll(): Promise<WeightCharge[]> {
    const manager = await this.tenantService.getEntityManager();
    return manager.find(WeightCharge, { order: { weightFrom: 'ASC' } });
  }

  async create(weightFrom: number, weightTo: number, charges: number): Promise<WeightCharge> {
    const manager = await this.tenantService.getEntityManager();
    const charge = manager.create(WeightCharge, { weightFrom, weightTo, charges });
    return manager.save(charge);
  }

  async delete(id: string): Promise<void> {
    const manager = await this.tenantService.getEntityManager();
    await manager.delete(WeightCharge, id);
  }
}
