import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('manifests')
@Index(['manifestNumber'])
@Index(['status'])
@Index(['type'])
@Index(['masterManifestId'])
export class Manifest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  manifestNumber: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  masterManifestId: string;

  @Column({ type: 'jsonb', nullable: true })
  data: any;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;
}
