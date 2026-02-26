import { Entity, Column, Index, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

const decimalTransformer = { to: (v: any) => v, from: (v: any) => v === null ? null : parseFloat(v) };

@Entity('bank_accounts')
@Index(['acctNumber'], { unique: true })
@Index(['bankCode'])
export class BankAccount extends BaseEntity {

  @Column({ length: 50 })
  bankCode: string;

  @Column({ length: 20, unique: true })
  acctNumber: string;

  @Column({ length: 50, nullable: true })
  branchName: string;

  @Column({ length: 20 })
  acctType: string;

  @Column({ length: 20 })
  currencyCode: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0, transformer: decimalTransformer })
  balance: number;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 30, nullable: true })
  bankTel: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
