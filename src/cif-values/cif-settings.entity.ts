import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

const dec = { to: (v: any) => v, from: (v: any) => v === null ? null : parseFloat(v) };

@Entity('cif_settings')
export class CifSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, transformer: dec })
  fobValue: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, transformer: dec })
  frtValue: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, transformer: dec })
  insValue: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;
}
