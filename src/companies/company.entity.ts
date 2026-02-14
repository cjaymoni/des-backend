import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'public' })
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  appSubdomain: string; // Used as tenant identifier

  @Column()
  companyName: string;

  @Column()
  companyTIN: string;

  @Column()
  address: string;

  @Column()
  location: string;

  @Column()
  telephone: string;

  @Column({ nullable: true })
  fax: string;

  @Column()
  email: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  vatPer: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  nhilPer: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  gfdPer: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  covidPer: string;

  @Column()
  cbm: string;

  @Column({ type: 'text', nullable: true })
  signature: string;

  @Column({ type: 'text', nullable: true })
  declFoot: string;

  @Column({ type: 'text', nullable: true })
  maniFoot: string;

  @Column({ type: 'text', nullable: true })
  rentFoot: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ nullable: true })
  logo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;
}
