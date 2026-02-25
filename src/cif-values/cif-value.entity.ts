import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Job } from '../jobs/job.entity';

const dec = { to: (v: any) => v, from: (v: any) => v === null ? null : parseFloat(v) };

@Entity('cif_values')
@Index(['refNo'])
export class CifValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  jobId: string;

  @ManyToOne(() => Job, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  /** Denormalized job number for quick reference */
  @Column({ length: 100 })
  refNo: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, transformer: dec })
  cifValue: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, transformer: dec })
  fobValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, transformer: dec })
  fobP: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, transformer: dec })
  frtValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, transformer: dec })
  frtP: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, transformer: dec })
  insValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, transformer: dec })
  insP: number;

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
