import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  Index, ManyToOne, JoinColumn,
} from 'typeorm';
import { BankAccount } from './bank-account.entity';

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal',
}

const decimalTransformer = { to: (v: any) => v, from: (v: any) => v === null ? null : parseFloat(v) };

@Entity('bank_transactions')
@Index(['bankAccountId'])
@Index(['transactionDate'])
export class BankTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  bankAccountId: string;

  @ManyToOne(() => BankAccount, (ba) => ba.transactions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bankAccountId' })
  bankAccount: BankAccount;

  @Column({ length: 50 })
  transPurpose: string;

  @Column({ length: 50, nullable: true })
  chequeNo: string;

  @Column({ type: 'enum', enum: TransactionType })
  transactionType: TransactionType;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, transformer: decimalTransformer })
  creditAmt: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, transformer: decimalTransformer })
  debitAmt: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, transformer: decimalTransformer })
  bankCharges: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0, transformer: decimalTransformer })
  balance: number;

  @Column({ type: 'date' })
  transactionDate: Date;

  @Column({ length: 50 })
  transactionBy: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;
}
