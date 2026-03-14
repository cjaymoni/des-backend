import {
  Entity,
  Column,
  Index,
  DeleteDateColumn,
  VersionColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';
import { HouseManifest } from '../../manifests/entities/house-manifest.entity';

@Entity('warehouse_jobs')
@Index(['jobNo'], { unique: true })
@Index(['hblNo'])
@Index(['houseManifestId'])
export class WarehouseJob extends BaseEntity {
  @Column({ unique: true })
  jobNo: string;

  @Column({ length: 20 })
  hblNo: string;

  @Column({ type: 'uuid' })
  houseManifestId: string;

  @ManyToOne(() => HouseManifest)
  @JoinColumn({ name: 'houseManifestId' })
  houseManifest: HouseManifest;

  @Column({ length: 200 })
  consigneeDetails: string;

  @Column({ type: 'int', default: 0 })
  noPkg: number;

  @Column({ length: 225, nullable: true })
  marksNum: string;

  @Column({ length: 50, nullable: true })
  containerNo: string;

  @Column({ length: 50, nullable: true })
  vessel: string;

  @Column({ length: 20, nullable: true })
  blNo: string;

  @Column({ length: 100, nullable: true })
  agentName: string;

  @Column({ length: 50, nullable: true })
  vehNo: string;

  @Column({ length: 50, nullable: true })
  declNo: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  transRemarks: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  weight: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  totalCBM: number;

  // Charge calculation fields
  @Column({ type: 'int', default: 0 })
  period: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  unitCharge: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  rentCharge: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  netRentCharge: number;

  // Tax components
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  vatPer: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  vatAmt: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  nhilPer: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  nhilAmt: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  gfdPer: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  gfdAmt: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  covidPer: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  covidAmt: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  grandTotal: number;

  // Cargo type surcharge
  @Column({ length: 50, nullable: true })
  cargoType: string;

  @Column({ type: 'int', default: 0 })
  cargoTypeLevel: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  cargoTypeAmt: number;

  // Dates
  @Column({ type: 'date', nullable: true })
  fileDate: Date;

  @Column({ type: 'date', nullable: true })
  unstuffDate: Date;

  @Column({ type: 'date', nullable: true })
  deliveryDate: Date;

  @Column({ type: 'date', nullable: true })
  arrivalDate: Date;

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

  // Status flags
  @Column({ default: false })
  paidStatus: boolean;

  @Column({ default: false })
  calcStatus: boolean;

  @Column({ default: false })
  incvatStatus: boolean;

  @Column({ length: 50, nullable: true })
  vatInvoice: string;

  @VersionColumn()
  version: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
