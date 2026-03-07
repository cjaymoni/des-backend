import {
  Entity, Column, Index, DeleteDateColumn, VersionColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { BankName } from './bank-name.entity';
import { BankTransaction } from './bank-transaction.entity';
import { Currency } from '../currencies/currency.entity';
import { AccountType } from './account-type.entity';

const dec = { to: (v: any) => v, from: (v: any) => (v === null ? null : parseFloat(v)) };

@Entity('bank_accounts')
@Index(['acctNumber'], { unique: true })
@Index(['bankNameId'])
export class BankAccount extends BaseEntity {
  @Column({ nullable: true })
  bankNameId: string;

  @ManyToOne(() => BankName, (bn) => bn.accounts, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bankNameId' })
  bankName: BankName;

  @Column({ length: 20, unique: true })
  acctNumber: string;

  @Column({ length: 50, nullable: true })
  branchName: string;

  @Column({ nullable: true })
  acctTypeId: string;

  @ManyToOne(() => AccountType, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'acctTypeId' })
  acctType: AccountType;

  @Column({ nullable: true })
  currencyId: string;

  @ManyToOne(() => Currency, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'currencyId' })
  currency: Currency;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0, transformer: dec })
  balance: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0, transformer: dec })
  availableBalance: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0, transformer: dec })
  totalBankCharges: number;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 30, nullable: true })
  bankTel: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @VersionColumn()
  version: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => BankTransaction, (tx) => tx.bankAccount)
  transactions: BankTransaction[];
}
