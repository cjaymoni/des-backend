import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TenantModule } from './tenant/tenant.module';
import { TenantMiddleware } from './tenant/tenant.middleware';
import { OptionalTenantMiddleware } from './tenant/optional-tenant.middleware';
import { AuthModule } from './auth/auth.module';
import { ManifestsModule } from './manifests/manifests.module';
import { CompanyModule } from './companies/company.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { WarmupInterceptor } from './health/warmup.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  providers: [
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
      .forRoutes('admin/*path', 'auth/*path', 'health', 'companies');

    consumer
      .apply(TenantMiddleware)
      .exclude('admin/*path', 'auth/*path', 'health', 'companies')
      .forRoutes('*');
  }
}
