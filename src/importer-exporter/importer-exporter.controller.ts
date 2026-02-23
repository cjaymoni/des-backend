import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImporterExporterService } from './importer-exporter.service';
import {
  CreateImporterExporterDto,
  UpdateImporterExporterDto,
  SearchImporterExporterDto,
} from './importer-exporter.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { ImporterExporter } from './importer-exporter.entity';

@Controller('importer-exporters')
@UseGuards(AuthGuard('jwt'))
export class ImporterExporterController {
  constructor(private service: ImporterExporterService) {}

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchImporterExporterDto,
  ): Promise<PaginatedResult<ImporterExporter>> {
    return this.service.findAll(pagination, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ImporterExporter> {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreateImporterExporterDto,
    @Req() req: { user: { id: string } },
  ): Promise<ImporterExporter> {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateImporterExporterDto,
    @Req() req: { user: { id: string } },
  ): Promise<ImporterExporter> {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
