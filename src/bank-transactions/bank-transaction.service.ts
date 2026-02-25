import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { BankTransaction, TransactionType } from './bank-transaction.entity';
import { BankAccount } from './bank-account.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import {
  CreateBankTransactionDto, UpdateBankTransactionDto, SearchBankTransactionDto,
  CreateBankAccountDto, UpdateBankAccountDto,
} from './bank-transaction.dto';

@Injectable()
export class BankTransactionService {
  constructor(private tenantService: TenantService) {}

  // ── Bank Accounts ──────────────────────────────────────────────────────────

  async findAllAccounts(): Promise<BankAccount[]> {
    return this.tenantService.withManager((manager) =>
      manager.getRepository(BankAccount).find({ order: { bankCode: 'ASC' } }),
    );
  }

  async findOneAccount(id: string): Promise<BankAccount> {
    return this.tenantService.withManager(async (manager) => {
      const account = await manager.getRepository(BankAccount).findOne({ where: { id } });
      if (!account) throw new NotFoundException('Bank account not found');
      return account;
    });
  }

  async createAccount(data: CreateBankAccountDto, userId: string): Promise<BankAccount> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(BankAccount).findOne({ where: { acctNumber: data.acctNumber } });
      if (existing) throw new BadRequestException(`Account number "${data.acctNumber}" already exists`);
      const account = manager.create(BankAccount, { ...data, createdBy: userId });
      return manager.save(account);
    });
  }

  async updateAccount(id: string, data: UpdateBankAccountDto, userId: string): Promise<BankAccount> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(BankAccount).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Bank account not found');
      const payload = Object.fromEntries(
        Object.entries({ ...data, updatedBy: userId }).filter(([, v]) => v !== undefined),
      );
      await manager.getRepository(BankAccount).update(id, payload);
      return manager.getRepository(BankAccount).findOne({ where: { id } }) as Promise<BankAccount>;
    });
  }

  async deleteAccount(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(BankAccount).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Bank account not found');
      await manager.getRepository(BankAccount).softDelete(id);
    });
  }

  // ── Bank Transactions ──────────────────────────────────────────────────────

  async findAll(pagination: PaginationDto, search: SearchBankTransactionDto): Promise<PaginatedResult<BankTransaction>> {
    return this.tenantService.withManager(async (manager) => {
      const { page, limit } = pagination;
      const qb = manager.getRepository(BankTransaction).createQueryBuilder('bt');

      if (search.bankCode) qb.andWhere('bt.bankCode = :bankCode', { bankCode: search.bankCode });
      if (search.acctNumber) qb.andWhere('bt.acctNumber = :acctNumber', { acctNumber: search.acctNumber });
      if (search.currencyCode) qb.andWhere('bt.currencyCode = :currencyCode', { currencyCode: search.currencyCode });
      if (search.strYear) {
        qb.andWhere('bt.transactionDate BETWEEN :from AND :to', {
          from: `${search.strYear}-01-01`,
          to: `${search.strYear}-12-31`,
        });
      }

      const [items, total] = await qb
        .skip((page - 1) * limit).take(limit)
        .orderBy('bt.transactionDate', 'DESC')
        .getManyAndCount();

      return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    });
  }

  async findOne(id: string): Promise<BankTransaction> {
    return this.tenantService.withManager(async (manager) => {
      const tx = await manager.getRepository(BankTransaction).findOne({ where: { id } });
      if (!tx) throw new NotFoundException('Transaction not found');
      return tx;
    });
  }

  async create(data: CreateBankTransactionDto, userId: string): Promise<BankTransaction> {
    return this.tenantService.withManager(async (manager) => {
      const account = await manager.getRepository(BankAccount).findOne({ where: { acctNumber: data.acctNumber } });
      if (!account) throw new NotFoundException(`Account "${data.acctNumber}" not found`);

      const isDeposit = data.transactionType === TransactionType.DEPOSIT;
      const creditAmt = isDeposit ? data.transactionAmount : 0;
      const debitAmt = isDeposit ? 0 : data.transactionAmount;
      const newBalance = isDeposit
        ? account.balance + data.transactionAmount
        : account.balance - data.transactionAmount;

      const tx = manager.create(BankTransaction, {
        ...data,
        creditAmt,
        debitAmt,
        balance: newBalance,
        bankCharges: data.bankCharges ?? 0,
        createdBy: userId,
      });

      const saved = await manager.save(tx);
      await manager.getRepository(BankAccount).update(account.id, { balance: newBalance });
      return saved;
    });
  }

  async update(id: string, data: UpdateBankTransactionDto, userId: string): Promise<BankTransaction> {
    return this.tenantService.withManager(async (manager) => {
      const existing = await manager.getRepository(BankTransaction).findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Transaction not found');
      const payload = Object.fromEntries(
        Object.entries({ ...data, updatedBy: userId }).filter(([, v]) => v !== undefined),
      );
      await manager.getRepository(BankTransaction).update(id, payload);
      return manager.getRepository(BankTransaction).findOne({ where: { id } }) as Promise<BankTransaction>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const tx = await manager.getRepository(BankTransaction).findOne({ where: { id } });
      if (!tx) throw new NotFoundException('Transaction not found');
      await manager.getRepository(BankTransaction).softDelete(id);
    });
  }

  async getSummary(acctNumber: string): Promise<{ balance: number; totalBankCharges: number }> {
    return this.tenantService.withManager(async (manager) => {
      const account = await manager.getRepository(BankAccount).findOne({ where: { acctNumber } });
      if (!account) throw new NotFoundException(`Account "${acctNumber}" not found`);

      const { totalCharges } = await manager.getRepository(BankTransaction)
        .createQueryBuilder('bt')
        .select('SUM(bt.bankCharges)', 'totalCharges')
        .where('bt.acctNumber = :acctNumber', { acctNumber })
        .getRawOne();

      return { balance: account.balance, totalBankCharges: parseFloat(totalCharges) || 0 };
    });
  }
}
