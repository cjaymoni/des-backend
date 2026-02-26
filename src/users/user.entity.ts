import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('users')
@Index(['email'])
@Index(['role'])
export class User extends BaseEntity {

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 'user' })
  role: 'user' | 'company_admin' | 'system_admin';

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;
}
