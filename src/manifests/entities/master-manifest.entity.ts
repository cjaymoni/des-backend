import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, DeleteDateColumn, OneToMany } from 'typeorm';
import { HouseManifest } from './house-manifest.entity';

@Entity('master_manifests')
@Index(['blNo'])
@Index(['vessel'])
@Index(['shippingLine'])
@Index(['containerNo'])
export class MasterManifest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
