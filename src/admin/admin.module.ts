import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MigrationController } from './migration.controller';

@Module({
  controllers: [AdminController, MigrationController],
  providers: [AdminService],
})
export class AdminModule {}
