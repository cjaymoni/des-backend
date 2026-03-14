import {
  Entity,
  Column,
  Index,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Principal } from '../principals/principal.entity';
import { Currency } from '../currencies/currency.entity';
import { PrincipalChargeType } from './principal-charge-type.entity';

@Entity('principal_charge_setups')
@Index(['principalId'], { unique: true })
export class PrincipalChargeSetup extends BaseEntity {
  @Column({ type: 'uuid' })
  principalId: string;

  @ManyToOne(() => Principal, { eager: true })
  @JoinColumn({ name: 'principalId' })
  principal: Principal;

  @Column({ type: 'uuid' })
  currencyId: string;

  @ManyToOne(() => Currency, { eager: true })
  @JoinColumn({ name: 'currencyId' })
  currency: Currency;

  @OneToMany(() => PrincipalChargeType, (ct) => ct.setup, {
    cascade: true,
    eager: true,
  })
  chargeTypes: PrincipalChargeType[];

  @DeleteDateColumn()
  deletedAt: Date;
}
