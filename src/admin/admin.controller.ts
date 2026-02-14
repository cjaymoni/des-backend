import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { AdminService } from './admin.service';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('system_admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('companies')
  getAllCompanies(@Query() pagination: PaginationDto): Promise<PaginatedResult<Company>> {
    return this.adminService.getAllCompanies(pagination);
  }

  @Get('users')
  getAllUsers(@Query() pagination: PaginationDto): Promise<PaginatedResult<Partial<User>>> {
    return this.adminService.getAllUsers(pagination);
  }

  @Get('stats')
  getStats(): Promise<{ companyCount: number; userCount: number }> {
    return this.adminService.getStats();
  }
}
