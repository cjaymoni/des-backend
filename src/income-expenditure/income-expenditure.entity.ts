import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('income_expenditures')
@Index(['transRemarks'])
@Index(['transType'])
@Index(['consignee'])
export class IncomeExpenditure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Links back to JobNo (transRemarks = jobNo in VB6) */
  @Column()
  transRemarks: string;

  @Column({ length: 20 })
  transType: string; // 'INCOME' | 'EXPENSE'

  @Column({ nullable: true })
  purposeCode: string;

  @Column({ nullable: true })
  detailCode: string;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  incomeAmt: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  netIncome: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  netIncVat: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  expenseAmt: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  netExpense: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  netExpVat: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  bbfAmt: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  incCheqAmt: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  expCheqAmt: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  incCheqVat: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  expCheqVat: number;

  @Column({ length: 10, default: '0' })
  payTerms: string;

  @Column({ length: 10, default: '0' })
  vatNhilStatus: string;

  @Column({ length: 200, nullable: true })
  consignee: string;

  @Column({ length: 20, nullable: true })
  hbl: string;

  @Column({ length: 200, nullable: true })
  agentDetails: string;

  @Column({ type: 'date', nullable: true })
  transactionDate: Date;

  @Column({ length: 10, nullable: true })
  strMonth: string;

  @Column({ length: 4, nullable: true })
  dateYear: string;

  @Column({ length: 100, nullable: true })
  transBy: string;

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
