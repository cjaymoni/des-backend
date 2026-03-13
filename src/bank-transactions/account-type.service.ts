import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { AccountType } from './account-type.entity';
import { CreateLookupDto } from './bank-transaction.dto';

@Injectable()
export class AccountTypeService {
  constructor(private readonly tenantService: TenantService) {}

  findAll(): Promise<AccountType[]> {
    return this.tenantService.withManager(
      (m) => m.getRepository(AccountType).find({ order: { name: 'ASC' } }),
      { transactional: false },
    );
  }

  create(data: CreateLookupDto, userId: string): Promise<AccountType> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(AccountType)
        .findOne({ where: { name: data.name } });
      if (existing)
        throw new BadRequestException(
          `Account type "${data.name}" already exists`,
        );
      return m.save(m.create(AccountType, { ...data, createdBy: userId }));
    });
  }

  update(
    id: string,
    data: CreateLookupDto,
    userId: string,
  ): Promise<AccountType> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(AccountType)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Account type not found');
      await m
        .getRepository(AccountType)
        .update(id, { ...data, updatedBy: userId });
      return m
        .getRepository(AccountType)
        .findOne({ where: { id } }) as Promise<AccountType>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(AccountType)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Account type not found');
      await m.getRepository(AccountType).delete(id);
    });
  }
}
