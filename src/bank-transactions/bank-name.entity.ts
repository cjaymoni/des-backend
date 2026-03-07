import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { BankAccount } from './bank-account.entity';

@Entity('bank_names')
@Index(['bankCode'], { unique: true })
export class BankName extends BaseEntity {
  @Column({ length: 10, unique: true })
  bankCode: string;

  @Column({ length: 150 })
  bankName: string;

  @OneToMany(() => BankAccount, (account) => account.bankName)
  accounts: BankAccount[];
}
