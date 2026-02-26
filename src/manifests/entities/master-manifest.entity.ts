import { Entity, Column, Index, DeleteDateColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { HouseManifest } from './house-manifest.entity';

@Entity('master_manifests')
@Index(['blNo'])
@Index(['vessel'])
@Index(['shippingLine'])
@Index(['containerNo'])
export class MasterManifest extends BaseEntity {

  @Column({ length: 20 })
  blNo: string;

  @Column({ length: 225 })
  containerNo: string;

  @Column({ length: 50 })
  vessel: string;

  @Column({ length: 10, nullable: true })
  voyage: string;

  @Column({ type: 'date', nullable: true })
  arrivalDate: Date;

  @Column({ type: 'date', nullable: true })
  rotationDate: Date;

  @Column({ length: 50, nullable: true })
  destination: string;

  @Column({ length: 50, nullable: true })
  portLoad: string;

  @Column({ length: 50, nullable: true })
  shippingLine: string;

  @Column({ length: 100, nullable: true })
  shipper: string;

  @Column({ length: 50, nullable: true })
  cntSize: string;

  @Column({ length: 50, nullable: true })
  sealNo: string;

  @Column({ length: 20, nullable: true })
  consignType: string;

  @Column({ length: 50, nullable: true })
  rptNo: string;

  @OneToMany(() => HouseManifest, house => house.masterManifest)
  houseManifests: HouseManifest[];

  @DeleteDateColumn()
  deletedAt: Date;
}
