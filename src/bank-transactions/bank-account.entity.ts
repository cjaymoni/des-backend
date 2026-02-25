import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index,
} from 'typeorm';

const decimalTransformer = { to: (v: any) => v, from: (v: any) => v === null ? null : parseFloat(v) };

@Entity('bank_accounts')
@Index(['acctNumber'], { unique: true })
@Index(['bankCode'])
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ length: 100, nullable: true })
  email: string;

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
