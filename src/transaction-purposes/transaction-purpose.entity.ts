import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('transaction_purposes')
export class TransactionPurpose extends BaseEntity {
  @Column({ length: 50, unique: true })
  purposeCode: string;

  @Column({ length: 150 })
  purposeName: string;
}
