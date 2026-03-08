import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { MasterManifest } from '../manifests/entities/master-manifest.entity';
import { HouseManifest } from '../manifests/entities/house-manifest.entity';
import { WeightCharge } from '../manifests/entities/weight-charge.entity';
import { Job } from '../jobs/job.entity';
import { Company } from '../companies/company.entity';
import { ImporterExporter } from '../importer-exporter/importer-exporter.entity';
import { ManifestJob } from '../manifest-jobs/manifest-job.entity';
import { IncomeExpenditure } from '../income-expenditure/income-expenditure.entity';
import { BankAccount } from 'src/bank-transactions/bank-account.entity';
import { BankTransaction } from 'src/bank-transactions/bank-transaction.entity';
import { BankName } from 'src/bank-transactions/bank-name.entity';
import { BankPurpose } from 'src/bank-transactions/bank-lookup.entity';
import { AccountType } from 'src/bank-transactions/account-type.entity';
import { CifValue } from 'src/cif-values/cif-value.entity';
import { CifSettings } from 'src/cif-values/cif-settings.entity';
import { ShippingLine } from '../shipping-lines/shipping-line.entity';
import { Principal } from '../principals/principal.entity';
import { Currency } from '../currencies/currency.entity';
import { PrincipalChargeSetup } from '../principal-charges/principal-charge-setup.entity';
import { PrincipalChargeType } from '../principal-charges/principal-charge-type.entity';
import { ChargeSetupAuditLog } from 'src/principal-charges/charge-setup-audit.entity';
import { TransactionPurpose } from 'src/transaction-purposes/transaction-purpose.entity';
import { TransactionPurposeDetail } from 'src/transaction-purposes/transaction-purpose-detail.entity';
import { JobTracking } from 'src/jobs/job-tracking.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [
    User,
    MasterManifest,
    HouseManifest,
    WeightCharge,
    Job,
    Company,
    ImporterExporter,
    ManifestJob,
    IncomeExpenditure,
    BankAccount,
    BankTransaction,
    BankName,
    BankPurpose,
    AccountType,
    CifValue,
    CifSettings,
    ShippingLine,
    Principal,
    Currency,
    PrincipalChargeSetup,
    PrincipalChargeType,
    ChargeSetupAuditLog,
    TransactionPurpose,
    TransactionPurposeDetail,
    JobTracking,
  ],
  synchronize: false,
  // schema: 'public',
  ssl: { rejectUnauthorized: false },
});
