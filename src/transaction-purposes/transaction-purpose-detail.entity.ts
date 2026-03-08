import { Entity, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { TransactionPurpose } from './transaction-purpose.entity';

@Entity('transaction_purpose_details')
export class TransactionPurposeDetail extends BaseEntity {
  @Column({ length: 50 })
  detailCode: string;

  @Column({ length: 50 })
  purposeCode: string;

  @Column({ length: 200 })
  purposeDetails: string;

  @ManyToOne(() => TransactionPurpose, (p) => p.details)
  @JoinColumn({ name: 'purposeCode', referencedColumnName: 'purposeCode' })
  purpose: TransactionPurpose;

  @DeleteDateColumn()
  deletedAt: Date;
}
