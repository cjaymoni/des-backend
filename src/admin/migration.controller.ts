import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { DataSource } from 'typeorm';
import { TENANT_SCHEMA_SQL } from '../config/tenant-schema.sql';

@Controller('admin/migrations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('system_admin')
export class MigrationController {
  constructor(private dataSource: DataSource) {}

  @Post('tenant/:subdomain')
  async runTenantMigration(@Param('subdomain') subdomain: string) {
    const schemaName = `tenant_${subdomain}`;
    
    await this.dataSource.query(`SET search_path TO "${schemaName}"`);
    await this.dataSource.query(TENANT_SCHEMA_SQL);
    await this.dataSource.query(`SET search_path TO public`);
    
    return { 
      message: `Migration completed for tenant: ${subdomain}`,
      schema: schemaName 
    };
  }
}
