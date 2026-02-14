import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  ForbiddenException,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { TenantContext } from '../tenant/tenant.context';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Controller('companies')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private tenantContext: TenantContext,
  ) {}

  @Post()
  @Roles('system_admin')
  create(@Body() data: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(data);
  }

  @Get()
  @Roles('system_admin')
  findAll(
    @Query() pagination: PaginationDto,
    @Req() req: { user: { role: string } },
  ): Promise<PaginatedResult<Company>> {
    if (req.user.role !== 'system_admin') {
      throw new ForbiddenException('Only system admins can view all companies');
    }
    return this.companyService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Company> {
    return this.companyService.findOne(id);
  }

  @Put(':id')
  @Roles('company_admin', 'system_admin')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCompanyDto,
    @Req() req: { user: { role: string; userId: string; email: string } },
  ): Promise<Company> {
    if (req.user.role === 'company_admin') {
      const company = await this.companyService.findOne(id);
      const currentTenant = this.tenantContext.getTenant();
      if (company.appSubdomain !== currentTenant) {
        throw new ForbiddenException('Cannot modify other companies');
      }
    }
    return this.companyService.update(id, data);
  }

  @Delete(':id')
  @Roles('system_admin')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.companyService.delete(id);
  }
}
