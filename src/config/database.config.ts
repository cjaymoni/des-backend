import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { MasterManifest } from '../manifests/entities/master-manifest.entity';
import { HouseManifest } from '../manifests/entities/house-manifest.entity';
import { WeightCharge } from '../manifests/entities/weight-charge.entity';
import { Job } from '../jobs/job.entity';
import { Company } from '../companies/company.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [User, MasterManifest, HouseManifest, WeightCharge, Job, Company],
  synchronize: false,
  // schema: 'public',
  ssl: { rejectUnauthorized: false },
});
