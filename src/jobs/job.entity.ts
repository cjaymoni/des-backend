import { Entity, Column, Index, DeleteDateColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { CifValue } from '../cif-values/cif-value.entity';

@Entity('jobs')
@Index(['jobNo'], { unique: true })
@Index(['ie'])
@Index(['blNo'])
export class Job extends BaseEntity {

  @Column({ unique: true })
  jobNo: string;

  /** Importer/Exporter name */
  @Column({ length: 200 })
  ie: string;

  @Column({ length: 100, nullable: true })
  custRefNo: string;

  @Column({ length: 100, nullable: true })
  vesselName: string;

  @Column({ length: 50, nullable: true })
  vesselEta: string;

  @Column({ length: 100, nullable: true })
  invoiceNo: string;

  @Column({
    type: 'decimal', precision: 12, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  totDuty: number;

  @Column({ type: 'text', nullable: true })
  qtyDescription: string;

  @Column({ length: 100, nullable: true })
  destination: string;

  @Column({ type: 'date', nullable: true })
  fileDate: Date;

  @Column({ length: 50, nullable: true })
  fileDate1: string;

  /** GCNET / reference job number */
  @Column({ length: 100, nullable: true })
  gcnetJob: string;

  @Column({ length: 100, nullable: true })
  oic: string;

  @Column({ length: 225, nullable: true })
  a2IdfNo: string;

  @Column({ length: 100, nullable: true })
  boeNo: string;

  @Column({ length: 20, nullable: true })
  blNo: string;

  @Column({ length: 50, nullable: true })
  transType: string;

  @Column({ length: 50, nullable: true })
  estCompDate: string;

  @Column({ length: 50, nullable: true })
  jobFinanceeType: string;

  @Column({ length: 200, nullable: true })
  jobFinanceeName: string;

  @Column({
    type: 'decimal', precision: 12, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  jobFinanceeAmount: number;

  @Column({
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) },
  })
  agencyFee: number;

  @Column({ length: 50, nullable: true })
  jobStatus: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  vatPer: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  nhilPer: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  gfdPer: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  covidPer: number;

  @Column({ type: 'text', nullable: true })
  containers: string;

  @Column({ length: 100, nullable: true })
  cntNo: string;

  @Column({ type: 'int', default: 0 })
  totItem: number;

  @Column({ length: 10, nullable: true })
  strMonth: string;

  @Column({ length: 4, nullable: true })
  strYear: string;

  @Column({ length: 10, default: '0' })
  vatNhilStatus: string;

  @Column({ default: false })
  paidStatus: boolean;

  @OneToMany(() => CifValue, (c) => c.job)
  cifValues: CifValue[];

  @DeleteDateColumn()
  deletedAt: Date;
}
