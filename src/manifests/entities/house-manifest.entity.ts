import {
  Entity,
  Column,
  Index,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  VersionColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { MasterManifest } from './master-manifest.entity';

@Entity('house_manifests')
@Index(['hblNo'])
@Index(['consignee'])
@Index(['masterManifestId'])
export class HouseManifest extends BaseEntity {
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

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (v) => v,
      from: (v) => (v === null ? null : parseFloat(v)),
    },
  })
  weight: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (v) => v,
      from: (v) => (v === null ? null : parseFloat(v)),
    },
  })
  totalCBM: number;

  @Column({ length: 225, nullable: true })
  marksNum: string;

  @Column({ type: 'text' })
  consignee: string;

  @Column({ length: 100, nullable: true })
  remark: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (v) => v,
      from: (v) => (v === null ? null : parseFloat(v)),
    },
  })
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

  @VersionColumn()
  version: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
