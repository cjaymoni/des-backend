import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MasterManifestService } from '../services/master-manifest.service';
import { CreateMasterManifestDto, UpdateMasterManifestDto, SearchMasterManifestDto } from '../dto/master/master-manifest.dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { MasterManifest } from '../entities/master-manifest.entity';

@Controller('manifests/master')
@UseGuards(AuthGuard('jwt'))
export class MasterManifestController {
  constructor(private service: MasterManifestService) {}

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchMasterManifestDto
  ): Promise<PaginatedResult<MasterManifest>> {
    return this.service.findAll(pagination, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MasterManifest> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: CreateMasterManifestDto, @Req() req): Promise<MasterManifest> {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateMasterManifestDto, @Req() req): Promise<MasterManifest> {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
