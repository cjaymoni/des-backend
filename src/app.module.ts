import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TenantModule } from './tenant/tenant.module';
import { TenantMiddleware } from './tenant/tenant.middleware';
import { OptionalTenantMiddleware } from './tenant/optional-tenant.middleware';
import { AuthModule } from './auth/auth.module';
import { ManifestsModule } from './manifests/manifests.module';
import { CompanyModule } from './companies/company.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { UploadsModule } from './uploads/uploads.module';
import { ImporterExporterModule } from './importer-exporter/importer-exporter.module';
import { ManifestJobModule } from './manifest-jobs/manifest-job.module';
import { IncomeExpenditureModule } from './income-expenditure/income-expenditure.module';
import { JobsModule } from './jobs/jobs.module';
import { BankTransactionsModule } from './bank-transactions/bank-transactions.module';
import { WarmupInterceptor } from './health/warmup.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true, ttl: 0 }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    HealthModule,
    TenantModule,
    CompanyModule,
    AuthModule,
    ManifestsModule,
    AdminModule,
    UsersModule,
    UploadsModule,
    ImporterExporterModule,
    ManifestJobModule,
    IncomeExpenditureModule,
    JobsModule,
    BankTransactionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: WarmupInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OptionalTenantMiddleware)
      .forRoutes('admin/*path', 'auth/*path', 'health', 'companies/*path');

    consumer
      .apply(TenantMiddleware)
      .exclude('admin/*path', 'auth/*path', 'health', 'companies/*path')
      .forRoutes('*');
  }
}
