import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ClsModule } from 'nestjs-cls';
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
import { CifValuesModule } from './cif-values/cif-values.module';
import { ShippingLineModule } from './shipping-lines/shipping-line.module';
import { PrincipalModule } from './principals/principal.module';
import { CurrencyModule } from './currencies/currency.module';
import { PrincipalChargeModule } from './principal-charges/principal-charge.module';
import { TransactionPurposeModule } from './transaction-purposes/transaction-purpose.module';
import { WarmupInterceptor } from './health/warmup.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ClsModule.forRoot({ middleware: { mount: true } }),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('CACHE_TTL_SECONDS') ?? 300,
      }),
      inject: [ConfigService],
    }),
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
    CifValuesModule,
    ShippingLineModule,
    PrincipalModule,
    CurrencyModule,
    PrincipalChargeModule,
    TransactionPurposeModule,
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
