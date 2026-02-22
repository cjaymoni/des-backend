import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MasterManifest } from './master-manifest.entity';

@Entity('house_manifests')
@Index(['hblNo'])
@Index(['consignee'])
@Index(['masterManifestId'])
export class HouseManifest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  masterManifestId: string;

  @ManyToOne(() => MasterManifest, (master) => master.houseManifests)
  @JoinColumn({ name: 'masterManifestId' })
  masterManifest: MasterManifest;

  @Column({ length: 20 })
  hblNo: string;

  @Column({ length: 100, nullable: true })
  shipper: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 0 })
  noPkg: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCBM: number;

  @Column({ length: 225, nullable: true })
  marksNum: string;

  @Column({ type: 'text' })
  consignee: string;

  @Column({ length: 100, nullable: true })
  remark: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  handCharge: number;

  @Column({ length: 50, nullable: true })
  hblType: string;

  @Column({ type: 'date', nullable: true })
  fileDate: Date;

  @Column({ default: false })
  releaseStatus: boolean;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  attachments: { url: string; publicId: string; filename: string }[];

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
