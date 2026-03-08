import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IsString } from 'class-validator';
import { TenantService } from '../tenant/tenant.service';
import { TransactionPurpose } from './transaction-purpose.entity';
import { TransactionPurposeDetail } from './transaction-purpose-detail.entity';

export class TransactionPurposeDto {
  @IsString()
  purposeCode: string;

  @IsString()
  purposeName: string;
}

@Injectable()
export class TransactionPurposeService {
  constructor(private readonly tenantService: TenantService) {}

  findAll(): Promise<TransactionPurpose[]> {
    return this.tenantService.withManager((m) =>
      m.getRepository(TransactionPurpose).find({ order: { purposeCode: 'ASC' } }),
    );
  }

  create(data: TransactionPurposeDto, userId: string): Promise<TransactionPurpose> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m.getRepository(TransactionPurpose).findOne({ where: { purposeCode: data.purposeCode } });
      if (existing) throw new BadRequestException(`Purpose code "${data.purposeCode}" already exists`);
      return m.save(m.create(TransactionPurpose, { ...data, createdBy: userId }));
    });
  }

  update(id: string, data: Partial<TransactionPurposeDto>, userId: string): Promise<TransactionPurpose> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m.getRepository(TransactionPurpose).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Transaction purpose not found');
      await m.getRepository(TransactionPurpose).update(id, { ...data, updatedBy: userId });
      return m.getRepository(TransactionPurpose).findOne({ where: { id } }) as Promise<TransactionPurpose>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (m) => {
      const existing = await m.getRepository(TransactionPurpose).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Transaction purpose not found');
      await m.getRepository(TransactionPurpose).delete(id);
    });
  }
}

export class TransactionPurposeDetailDto {
  @IsString() detailCode: string;
  @IsString() purposeCode: string;
  @IsString() purposeDetails: string;
}

@Injectable()
export class TransactionPurposeDetailService {
  constructor(private readonly tenantService: TenantService) {}

  findByPurpose(purposeCode: string): Promise<TransactionPurposeDetail[]> {
    return this.tenantService.withManager((m) =>
      m.getRepository(TransactionPurposeDetail).find({
        where: { purposeCode },
        order: { purposeDetails: 'ASC' },
      }),
    );
  }

  create(data: TransactionPurposeDetailDto, userId: string): Promise<TransactionPurposeDetail> {
    return this.tenantService.withManager(async (m) => {
      const purpose = await m.getRepository(TransactionPurpose).findOne({ where: { purposeCode: data.purposeCode } });
      if (!purpose) throw new NotFoundException(`Purpose code "${data.purposeCode}" not found`);
      return m.save(m.create(TransactionPurposeDetail, { ...data, createdBy: userId }));
    });
  }

  update(id: string, data: Partial<TransactionPurposeDetailDto>, userId: string): Promise<TransactionPurposeDetail> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m.getRepository(TransactionPurposeDetail).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Detail not found');
      await m.getRepository(TransactionPurposeDetail).update(id, { ...data, updatedBy: userId });
      return m.getRepository(TransactionPurposeDetail).findOne({ where: { id } }) as Promise<TransactionPurposeDetail>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (m) => {
      const existing = await m.getRepository(TransactionPurposeDetail).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Detail not found');
      await m.getRepository(TransactionPurposeDetail).softDelete(id);
    });
  }
}
