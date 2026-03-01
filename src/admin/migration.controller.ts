import {
  Controller,
  Post,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
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
    if (!/^[a-z0-9][a-z0-9_-]{0,62}$/i.test(subdomain)) {
      throw new BadRequestException('Invalid subdomain format');
    }
    const schemaName = `tenant_${subdomain}`;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`SET LOCAL search_path TO "${schemaName}"`);
      await queryRunner.query(TENANT_SCHEMA_SQL);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return {
      message: `Migration completed for tenant: ${subdomain}`,
      schema: schemaName,
    };
  }
}
