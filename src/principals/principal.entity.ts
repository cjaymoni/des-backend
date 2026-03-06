import { Entity, Column, Index, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('principals')
@Index(['name'], { unique: true })
export class Principal extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn()
  deletedAt: Date;
}
