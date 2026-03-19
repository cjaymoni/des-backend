import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('email_logs')
@Index(['userId'])
@Index(['module'])
export class EmailLog extends BaseEntity {
  @Column()
  recipient: string;

  @Column('text')
  body: string;

  @Column()
  subject: string;

  @Column()
  module: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'sent' | 'failed';

  @Column({ nullable: true, type: 'text' })
  error: string;
}
