import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { BankTransaction, TransactionType } from './bank-transaction.entity';
import { BankAccount } from './bank-account.entity';
import { BankName } from './bank-name.entity';
import { BankPurpose } from './bank-lookup.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import {
  CreateBankTransactionDto,
  UpdateBankTransactionDto,
  SearchBankTransactionDto,
  CreateBankAccountDto,
  UpdateBankAccountDto,
  CreateBankNameDto,
  UpdateBankNameDto,
  CreateLookupDto,
} from './bank-transaction.dto';

@Injectable()
export class BankTransactionService {
  constructor(private tenantService: TenantService) {}

  // ── Bank Names ─────────────────────────────────────────────────────────────

  async findAllBankNames(): Promise<BankName[]> {
    return this.tenantService.withManager(
      (m) => m.getRepository(BankName).find({ order: { bankCode: 'ASC' } }),
      { transactional: false },
    );
  }

  async createBankName(
    data: CreateBankNameDto,
    userId: string,
  ): Promise<BankName> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(BankName)
        .findOne({ where: { bankCode: data.bankCode } });
      if (existing)
        throw new BadRequestException(
          `Bank code "${data.bankCode}" already exists`,
        );
      return m.save(m.create(BankName, { ...data, createdBy: userId }));
    });
  }

  async updateBankName(
    id: string,
    data: UpdateBankNameDto,
    userId: string,
  ): Promise<BankName> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(BankName)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Bank name not found');
      await m
        .getRepository(BankName)
        .update(id, { ...data, updatedBy: userId });
      return m
        .getRepository(BankName)
        .findOne({ where: { id } }) as Promise<BankName>;
    });
  }

  async deleteBankName(id: string): Promise<void> {
    await this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(BankName)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Bank name not found');
      await m.getRepository(BankName).delete(id);
    });
  }

  // ── Bank Accounts ──────────────────────────────────────────────────────────

  async findAllAccounts(): Promise<BankAccount[]> {
    return this.tenantService.withManager(
      (m) =>
        m.getRepository(BankAccount).find({
          relations: ['bankName', 'acctType', 'currency'],
          order: { acctNumber: 'ASC' },
        }),
      { transactional: false },
    );
  }

  async findOneAccount(id: string): Promise<BankAccount> {
    return this.tenantService.withManager(
      async (m) => {
        const account = await m.getRepository(BankAccount).findOne({
          where: { id },
          relations: ['bankName', 'acctType', 'currency'],
        });
        if (!account) throw new NotFoundException('Bank account not found');
        return account;
      },
      { transactional: false },
    );
  }

  async createAccount(
    data: CreateBankAccountDto,
    userId: string,
  ): Promise<BankAccount> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(BankAccount)
        .findOne({ where: { acctNumber: data.acctNumber } });
      if (existing)
        throw new BadRequestException(
          `Account number "${data.acctNumber}" already exists`,
        );

      if (data.bankNameId) {
        const bankName = await m
          .getRepository(BankName)
          .findOne({ where: { id: data.bankNameId } });
        if (!bankName) throw new NotFoundException(`Bank name not found`);
      }

      try {
        return await m.save(
          m.create(BankAccount, { ...data, createdBy: userId }),
        );
      } catch (err: any) {
        if (err.code === '23505')
          throw new BadRequestException(
            `Account number "${data.acctNumber}" already exists`,
          );
        throw err;
      }
    });
  }

  async updateAccount(
    id: string,
    data: UpdateBankAccountDto,
    userId: string,
  ): Promise<BankAccount> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(BankAccount)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Bank account not found');
      const payload = Object.fromEntries(
        Object.entries({ ...data, updatedBy: userId }).filter(
          ([, v]) => v !== undefined,
        ),
      );
      await m.getRepository(BankAccount).update(id, payload);
      return m.getRepository(BankAccount).findOne({
        where: { id },
        relations: ['bankName', 'acctType', 'currency'],
      }) as Promise<BankAccount>;
    });
  }

  async deleteAccount(id: string): Promise<void> {
    await this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(BankAccount)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Bank account not found');
      await m.getRepository(BankAccount).softDelete(id);
    });
  }

  // ── Bank Transactions ──────────────────────────────────────────────────────

  async findAll(
    pagination: PaginationDto,
    search: SearchBankTransactionDto,
  ): Promise<PaginatedResult<BankTransaction>> {
    return this.tenantService.withManager(
      async (m) => {
        const { page, limit } = pagination;
        const qb = m
          .getRepository(BankTransaction)
          .createQueryBuilder('bt')
          .leftJoinAndSelect('bt.bankAccount', 'ba')
          .leftJoinAndSelect('ba.bankName', 'bn');

        if (search.bankAccountId)
          qb.andWhere('bt.bankAccountId = :bankAccountId', {
            bankAccountId: search.bankAccountId,
          });
        if (search.bankNameId)
          qb.andWhere('ba.bankNameId = :bankNameId', {
            bankNameId: search.bankNameId,
          });
        if (search.strYear) {
          qb.andWhere('bt.transactionDate BETWEEN :from AND :to', {
            from: `${search.strYear}-01-01`,
            to: `${search.strYear}-12-31`,
          });
        }

        const [items, total] = await qb
          .skip((page - 1) * limit)
          .take(limit)
          .orderBy('bt.transactionDate', 'DESC')
          .getManyAndCount();

        return {
          items,
          meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
      },
      { transactional: false },
    );
  }

  async findOne(id: string): Promise<BankTransaction> {
    return this.tenantService.withManager(
      async (m) => {
        const tx = await m.getRepository(BankTransaction).findOne({
          where: { id },
          relations: ['bankAccount', 'bankAccount.bankName'],
        });
        if (!tx) throw new NotFoundException('Transaction not found');
        return tx;
      },
      { transactional: false },
    );
  }

  async create(
    data: CreateBankTransactionDto,
    userId: string,
  ): Promise<BankTransaction> {
    return this.tenantService.withManager(async (m) => {
      const account = await m
        .getRepository(BankAccount)
        .createQueryBuilder('ba')
        .setLock('pessimistic_write')
        .where('ba.id = :id', { id: data.bankAccountId })
        .getOne();
      if (!account) throw new NotFoundException(`Account not found`);

      const isDeposit = data.transactionType === TransactionType.DEPOSIT;
      const creditAmt = isDeposit ? data.transactionAmount : 0;
      const debitAmt = isDeposit ? 0 : data.transactionAmount;
      const newBalance = isDeposit
        ? account.balance + data.transactionAmount
        : account.balance - data.transactionAmount;

      const tx = m.create(BankTransaction, {
        bankAccountId: data.bankAccountId,
        transPurpose: data.transPurpose,
        chequeNo: data.chequeNo,
        transactionType: data.transactionType,
        creditAmt,
        debitAmt,
        balance: newBalance,
        bankCharges: data.bankCharges ?? 0,
        transactionDate: data.transactionDate,
        transactionBy: data.transactionBy,
        remarks: data.remarks,
        createdBy: userId,
      });

      const saved = await m.save(tx);

      const charges = data.bankCharges ?? 0;
      await m
        .getRepository(BankAccount)
        .createQueryBuilder()
        .update()
        .set({
          balance: () =>
            isDeposit
              ? `balance + ${data.transactionAmount}`
              : `balance - ${data.transactionAmount}`,
          totalBankCharges: () => `"totalBankCharges" + ${charges}`,
          availableBalance: () =>
            isDeposit
              ? `balance + ${data.transactionAmount} - ("totalBankCharges" + ${charges})`
              : `balance - ${data.transactionAmount} - ("totalBankCharges" + ${charges})`,
        })
        .where('id = :id', { id: account.id })
        .execute();

      return saved;
    });
  }

  async update(
    id: string,
    data: UpdateBankTransactionDto,
    userId: string,
  ): Promise<BankTransaction> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(BankTransaction)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Transaction not found');

      const oldAmount =
        existing.transactionType === TransactionType.DEPOSIT
          ? existing.creditAmt
          : -existing.debitAmt;
      const oldCharges = existing.bankCharges ?? 0;

      const payload = Object.fromEntries(
        Object.entries({ ...data, updatedBy: userId }).filter(
          ([, v]) => v !== undefined,
        ),
      );
      await m.getRepository(BankTransaction).update(id, payload);

      // Recalculate account totals from all transactions
      await this.recalcAccount(m, existing.bankAccountId);

      return m.getRepository(BankTransaction).findOne({
        where: { id },
        relations: ['bankAccount', 'bankAccount.bankName'],
      }) as Promise<BankTransaction>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (m) => {
      const tx = await m
        .getRepository(BankTransaction)
        .findOne({ where: { id } });
      if (!tx) throw new NotFoundException('Transaction not found');
      await m.getRepository(BankTransaction).softDelete(id);
      await this.recalcAccount(m, tx.bankAccountId);
    });
  }

  private async recalcAccount(m: any, bankAccountId: string): Promise<void> {
    const { totalCredit, totalDebit, totalCharges } = await m
      .getRepository(BankTransaction)
      .createQueryBuilder('bt')
      .select('COALESCE(SUM(bt.creditAmt), 0)', 'totalCredit')
      .addSelect('COALESCE(SUM(bt.debitAmt), 0)', 'totalDebit')
      .addSelect('COALESCE(SUM(bt.bankCharges), 0)', 'totalCharges')
      .where('bt.bankAccountId = :bankAccountId', { bankAccountId })
      .andWhere('bt.deletedAt IS NULL')
      .getRawOne();

    const balance = parseFloat(totalCredit) - parseFloat(totalDebit);
    const charges = parseFloat(totalCharges);
    await m.getRepository(BankAccount).update(bankAccountId, {
      balance,
      totalBankCharges: charges,
      availableBalance: balance - charges,
    });
  }

  async getSummary(bankAccountId: string): Promise<{
    balance: number;
    availableBalance: number;
    totalBankCharges: number;
  }> {
    return this.tenantService.withManager(
      async (m) => {
        const account = await m
          .getRepository(BankAccount)
          .findOne({ where: { id: bankAccountId } });
        if (!account) throw new NotFoundException(`Account not found`);

        const { totalCharges } = await m
          .getRepository(BankTransaction)
          .createQueryBuilder('bt')
          .select('SUM(bt.bankCharges)', 'totalCharges')
          .where('bt.bankAccountId = :bankAccountId', { bankAccountId })
          .getRawOne();

        return {
          balance: account.balance,
          availableBalance: account.availableBalance,
          totalBankCharges: parseFloat(totalCharges) || 0,
        };
      },
      { transactional: false },
    );
  }

  // ── Finance Summary Report (RptxBank) ──────────────────────────────────────

  async getFinanceSummary(dateFrom?: string, dateTo?: string) {
    return this.tenantService.withManager(
      async (m) => {
        const qb = m
          .getRepository(BankTransaction)
          .createQueryBuilder('bt')
          .select('ba.id', 'bankAccountId')
          .addSelect('ba.acctNumber', 'acctNumber')
          .addSelect('bn.bankName', 'bankName')
          .addSelect('ba.balance', 'balance')
          .addSelect('SUM(bt.debitAmt)', 'totDebit')
          .addSelect('SUM(bt.creditAmt)', 'totCredit')
          .addSelect('SUM(bt.bankCharges)', 'totBankCharges')
          .innerJoin('bt.bankAccount', 'ba')
          .innerJoin('ba.bankName', 'bn')
          .groupBy('ba.id')
          .addGroupBy('ba.acctNumber')
          .addGroupBy('bn.bankName')
          .addGroupBy('ba.balance');

        if (dateFrom && dateTo) {
          qb.where('bt.transactionDate BETWEEN :dateFrom AND :dateTo', {
            dateFrom,
            dateTo,
          });
        }

        const rows = await qb.getRawMany();
        return rows.map((r) => ({
          bankAccountId: r.bankAccountId,
          acctNumber: r.acctNumber,
          bankName: r.bankName,
          balance: parseFloat(r.balance) || 0,
          totDebit: parseFloat(r.totDebit) || 0,
          totCredit: parseFloat(r.totCredit) || 0,
          totBankCharges: parseFloat(r.totBankCharges) || 0,
        }));
      },
      { transactional: false },
    );
  }

  // ── Bank Purposes ──────────────────────────────────────────────────────────

  async findAllPurposes(): Promise<BankPurpose[]> {
    return this.tenantService.withManager(
      (m) => m.getRepository(BankPurpose).find({ order: { name: 'ASC' } }),
      { transactional: false },
    );
  }

  async createPurpose(
    data: CreateLookupDto,
    userId: string,
  ): Promise<BankPurpose> {
    return this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(BankPurpose)
        .findOne({ where: { name: data.name } });
      if (existing)
        throw new BadRequestException(`Purpose "${data.name}" already exists`);
      return m.save(m.create(BankPurpose, { ...data, createdBy: userId }));
    });
  }

  async deletePurpose(id: string): Promise<void> {
    await this.tenantService.withManager(async (m) => {
      const existing = await m
        .getRepository(BankPurpose)
        .findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Purpose not found');
      await m.getRepository(BankPurpose).delete(id);
    });
  }
}
