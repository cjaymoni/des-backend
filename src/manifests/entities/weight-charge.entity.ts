import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('weight_charges')
export class WeightCharge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (v) => v,
      from: (v) => (v === null ? null : parseFloat(v)),
    },
  })
  weightFrom: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (v) => v,
      from: (v) => (v === null ? null : parseFloat(v)),
    },
  })
  weightTo: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (v) => v,
      from: (v) => (v === null ? null : parseFloat(v)),
    },
  })
  charges: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
