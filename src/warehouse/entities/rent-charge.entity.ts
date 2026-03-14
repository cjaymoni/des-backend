import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';

@Entity('rent_charges')
export class RentCharge extends BaseEntity {
  @Column({ type: 'int' })
  dayFrom: number;

  @Column({ type: 'int' })
  dayTo: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  unitCharge: number;
}
