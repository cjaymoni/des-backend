import { Entity, Column, Index, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

const dec = {
  to: (v: any) => v,
  from: (v: any) => (v === null ? null : parseFloat(v)),
};

@Entity('currencies')
@Index(['code'], { unique: true })
export class Currency extends BaseEntity {
  @Column({ length: 10, unique: true })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 4,
    default: 1,
    transformer: dec,
  })
  rate: number;

  @Column({ length: 50, nullable: true })
  period: string;

  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn()
  deletedAt: Date;
}
