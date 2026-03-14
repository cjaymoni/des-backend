import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { RentCharge } from './entities/rent-charge.entity';
import { CreateRentChargeDto, UpdateRentChargeDto } from './rent-charge.dto';

@Injectable()
export class RentChargeService {
  constructor(private readonly tenantService: TenantService) {}

  findAll(): Promise<RentCharge[]> {
    return this.tenantService.withManager(
      (m) =>
        m.getRepository(RentCharge).find({ order: { dayFrom: 'ASC' } }),
      { transactional: false },
    );
  }

  findOne(id: string): Promise<RentCharge> {
    return this.tenantService.withManager(
      async (m) => {
        const record = await m
          .getRepository(RentCharge)
          .findOne({ where: { id } });
        if (!record) throw new NotFoundException('Rent charge bracket not found');
        return record;
      },
      { transactional: false },
    );
  }

  create(data: CreateRentChargeDto, userId: string): Promise<RentCharge> {
    return this.tenantService.withManager(async (m) => {
      await this.validateNoOverlap(m, data.dayFrom, data.dayTo);
      return m.save(m.create(RentCharge, { ...data, createdBy: userId }));
    });
  }

  update(
    id: string,
    data: UpdateRentChargeDto,
    userId: string,
  ): Promise<RentCharge> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(RentCharge)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Rent charge bracket not found');

      const dayFrom = data.dayFrom ?? existing.dayFrom;
      const dayTo = data.dayTo ?? existing.dayTo;
      await this.validateNoOverlap(m, dayFrom, dayTo, id);

      await m
        .getRepository(RentCharge)
        .update(id, { ...data, updatedBy: userId });
      return m
        .getRepository(RentCharge)
        .findOne({ where: { id } }) as Promise<RentCharge>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(RentCharge)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Rent charge bracket not found');
      await m.getRepository(RentCharge).delete(id);
    });
  }

  /** Ensures no two brackets overlap in day ranges */
  private async validateNoOverlap(
    m: any,
    dayFrom: number,
    dayTo: number,
    excludeId?: string,
  ): Promise<void> {
    if (dayFrom >= dayTo)
      throw new BadRequestException('dayFrom must be less than dayTo');

    const qb = m
      .getRepository(RentCharge)
      .createQueryBuilder('rc')
      .where('rc.dayFrom < :dayTo AND rc.dayTo > :dayFrom', { dayFrom, dayTo });

    if (excludeId) qb.andWhere('rc.id != :excludeId', { excludeId });

    const overlap = await qb.getOne();
    if (overlap)
      throw new BadRequestException(
        `Day range ${dayFrom}–${dayTo} overlaps with existing bracket ${overlap.dayFrom}–${overlap.dayTo}`,
      );
  }
}
