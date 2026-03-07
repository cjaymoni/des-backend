import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('bank_purposes')
export class BankPurpose extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;
}
