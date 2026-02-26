import { Entity, Column, Index, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('importer_exporters')
@Index(['ieName'])
@Index(['code'])
export class ImporterExporter extends BaseEntity {

  @Column({ unique: true })
  code: string;

  @Column({ length: 200 })
  ieName: string;

  @Column({ length: 200, nullable: true })
  address: string;

  @Column({ length: 50, nullable: true })
  telephone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
