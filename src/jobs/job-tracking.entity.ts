import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Job } from './job.entity';
import { TransactionPurposeDetail } from '../transaction-purposes/transaction-purpose-detail.entity';

@Entity('job_tracking')
@Index(['jobNo'])
export class JobTracking extends BaseEntity {
  @Column()
  jobNo: string;

  @Column({ length: 50, nullable: true })
  purposeCode: string;

  @Column({ length: 50, nullable: true })
  detailCode: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: { to: (v) => v, from: (v) => parseFloat(v) },
  })
  transAmount: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: { to: (v) => v, from: (v) => parseFloat(v) },
  })
  vatAmount: number;

  @Column({ default: false })
  vatStatus: boolean;

  @Column({ length: 100, nullable: true })
  transBy: string;

  @Column({ type: 'date', nullable: true })
  transactionDate: Date;

  @ManyToOne(() => Job, (j) => j.tracking)
  @JoinColumn({ name: 'jobNo', referencedColumnName: 'jobNo' })
  job: Job;

  @ManyToOne(() => TransactionPurposeDetail)
  @JoinColumn({ name: 'detailCode', referencedColumnName: 'detailCode' })
  detail: TransactionPurposeDetail;

  @DeleteDateColumn()
  deletedAt: Date;
}
