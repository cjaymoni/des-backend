import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('account_types')
export class AccountType extends BaseEntity {
  @Column({ length: 50, unique: true })
  name: string;
}
