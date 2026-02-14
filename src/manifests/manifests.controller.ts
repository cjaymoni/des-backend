import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ManifestsService } from './manifests.service';
import { CreateManifestDto, UpdateManifestDto } from './dto/manifest.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { Manifest } from './manifest.entity';

@Controller('manifests')
@UseGuards(AuthGuard('jwt'))
export class ManifestsController {
  constructor(private manifestsService: ManifestsService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto): Promise<PaginatedResult<Manifest>> {
    return this.manifestsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manifestsService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateManifestDto) {
    return this.manifestsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateManifestDto) {
    return this.manifestsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.manifestsService.delete(id);
  }
}
