import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Immutable audit log for principal charge setup changes.
 * A new row is inserted every time a charge setup is created, updated, or deleted.
 */
@Entity('charge_setup_audit_logs')
export class ChargeSetupAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  principalId: string;

  @Column({ length: 100 })
  principalName: string;

  @Column({ type: 'varchar', length: 20 })
  action: 'CREATED' | 'UPDATED' | 'DELETED';

  @Column({ type: 'uuid', nullable: true })
  currencyId: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currencyCode: string | null;

  /** Snapshot of the charge types at the time of the change */
  @Column({ type: 'jsonb', nullable: true })
  chargeTypes:
    | {
        chargeType: string;
        calcMode: string;
        minValue: number | null;
        maxValue: number | null;
        fixedValue: number | null;
        sortOrder: number;
      }[]
    | null;

  /** Previous charge types (for updates) */
  @Column({ type: 'jsonb', nullable: true })
  previousChargeTypes:
    | {
        chargeType: string;
        calcMode: string;
        minValue: number | null;
        maxValue: number | null;
        fixedValue: number | null;
        sortOrder: number;
      }[]
    | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  previousCurrencyCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  performedBy: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
