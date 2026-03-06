import { Entity, Column, Index, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { PrincipalChargeSetup } from './principal-charge-setup.entity';

export type CalcMode = 'MIN_MAX' | 'MAX' | 'FIXED';

const dec = { to: (v: any) => v, from: (v: any) => (v === null ? null : parseFloat(v)) };

@Entity('principal_charge_types')
@Index(['setupId', 'chargeType'], { unique: true })
export class PrincipalChargeType extends BaseEntity {
  @Column({ type: 'uuid' })
  setupId: string;

  @ManyToOne(() => PrincipalChargeSetup, (s) => s.chargeTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'setupId' })
  setup: PrincipalChargeSetup;

  @Column({ length: 50 })
  chargeType: string;

  @Column({ length: 10 })
  calcMode: CalcMode;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true, transformer: dec })
  minValue: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true, transformer: dec })
  maxValue: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true, transformer: dec })
  fixedValue: number | null;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
