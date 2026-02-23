import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ManifestJobService } from './manifest-job.service';
import { CreateManifestJobDto, UpdateManifestJobDto, SearchManifestJobDto } from './manifest-job.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { ManifestJob } from './manifest-job.entity';

@Controller('manifest-jobs')
@UseGuards(AuthGuard('jwt'))
export class ManifestJobController {
  constructor(private service: ManifestJobService) {}

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchManifestJobDto,
  ): Promise<PaginatedResult<ManifestJob>> {
    return this.service.findAll(pagination, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ManifestJob> {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreateManifestJobDto,
    @Req() req: { user: { id: string } },
  ): Promise<ManifestJob> {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateManifestJobDto,
    @Req() req: { user: { id: string } },
  ): Promise<ManifestJob> {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
