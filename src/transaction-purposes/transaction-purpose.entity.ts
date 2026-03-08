import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { TransactionPurposeDetail } from './transaction-purpose-detail.entity';

@Entity('transaction_purposes')
export class TransactionPurpose extends BaseEntity {
  @Column({ length: 50, unique: true })
  purposeCode: string;

  @Column({ length: 150 })
  purposeName: string;

  @OneToMany(() => TransactionPurposeDetail, (d) => d.purpose)
  details: TransactionPurposeDetail[];
}
