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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../common/utils/file-filter.util';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { TenantContext } from '../tenant/tenant.context';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Controller('companies')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private tenantContext: TenantContext,
  ) {}

  @Get('subdomain/:subdomain/public')
  async findBySubdomainPublic(@Param('subdomain') subdomain: string) {
    return this.companyService.findBySubdomainPublic(subdomain);
  }

  @Get('subdomain/:subdomain')
  @UseGuards(AuthGuard('jwt'))
  async findBySubdomain(@Param('subdomain') subdomain: string): Promise<Company> {
    return this.companyService.findBySubdomain(subdomain);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('system_admin')
  create(@Body() data: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(data);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Company> {
    return this.companyService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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

  @Post(':id/logo')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('company_admin', 'system_admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: require('multer').diskStorage({
        destination: './temp-uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter,
    }),
  )
  async uploadLogo(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: any,
    @Req() req: any,
  ): Promise<Company> {
    console.log('Received file:', file);

    if (req.user.role === 'company_admin') {
      const company = await this.companyService.findOne(id);
      const currentTenant = this.tenantContext.getTenant();
      if (company.appSubdomain !== currentTenant) {
        throw new ForbiddenException('Cannot modify other companies');
      }
    }
    return this.companyService.uploadLogo(id, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('system_admin')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.companyService.delete(id);
  }
}
