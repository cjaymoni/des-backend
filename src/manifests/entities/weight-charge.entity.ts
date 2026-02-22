import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('weight_charges')
export class WeightCharge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weightFrom: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weightTo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  charges: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
