import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { HouseManifest } from '../manifests/entities/house-manifest.entity';

@Entity('manifest_jobs')
@Index(['jobNo'], { unique: true })
@Index(['hblNo'])
export class ManifestJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ length: 100, nullable: true })
  custRefNo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  handCharge: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  netHandCharge: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  grandHandCharge: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  vatAmt: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  nhilAmt: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  gfdAmt: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  covidAmt: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  totalCBM: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: { to: v => v, from: v => v === null ? null : parseFloat(v) } })
  weight: number;

  @Column({ type: 'date', nullable: true })
  fileDate: Date;

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

  @Column({ default: false })
  paidStatus: boolean;

  @Column({ default: false })
  releaseStatus: boolean;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ length: 10, nullable: true })
  calcStatus: string;

  @Column({ length: 10, nullable: true })
  incvatStatus: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 225, nullable: true })
  marksNum: string;

  @Column({ length: 20, nullable: true })
  shipBl: string;

  @Column({ length: 50, nullable: true })
  hblType: string;

  @Column({ length: 200, nullable: true })
  hblTypeRemarks: string;

  @Column({ length: 200, nullable: true })
  agentDetails: string;

  @Column({ length: 100, nullable: true })
  agentName: string;

  @Column({ length: 50, nullable: true })
  agentTel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;
}
