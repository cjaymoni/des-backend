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
import { CifValue } from 'src/cif-values/cif-value.entity';
import { CifSettings } from 'src/cif-values/cif-settings.entity';

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
    CifValue,
    CifSettings,
  ],
  synchronize: false,
  // schema: 'public',
  ssl: { rejectUnauthorized: false },
});
