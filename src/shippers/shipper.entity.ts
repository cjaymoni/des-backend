import { Entity, Column, Index, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('shippers')
@Index(['name'], { unique: true })
export class Shipper extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
