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
import { WarehouseJobService } from './warehouse-job.service';
import {
  CreateWarehouseJobDto,
  UpdateWarehouseJobDto,
  SearchWarehouseJobDto,
} from './warehouse-job.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { WarehouseJob } from './entities/warehouse-job.entity';
import { HouseManifest } from '../manifests/entities/house-manifest.entity';
import { RentChargeResult } from './rent-charge.engine';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

class PreviewRentDto {
  @Type(() => Date)
  @IsDate()
  unstuffDate: Date;

  @Type(() => Date)
  @IsDate()
  deliveryDate: Date;
}

@Controller('warehouse/jobs')
@UseGuards(AuthGuard('jwt'))
export class WarehouseJobController {
  constructor(private readonly service: WarehouseJobService) {}

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchWarehouseJobDto,
  ): Promise<PaginatedResult<WarehouseJob>> {
    return this.service.findAll(pagination, search);
  }

  @Get('available-hbls')
  findAvailableHbls(
    @Query('search') search?: string,
  ): Promise<HouseManifest[]> {
    return this.service.findAvailableHbls(search);
  }

  @Get('preview-rent')
  previewRentCharge(
    @Query() query: PreviewRentDto,
  ): Promise<RentChargeResult> {
    return this.service.previewRentCharge(query.unstuffDate, query.deliveryDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<WarehouseJob> {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreateWarehouseJobDto,
    @Req() req: { user: { id: string } },
  ): Promise<WarehouseJob> {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateWarehouseJobDto,
    @Req() req: { user: { id: string } },
  ): Promise<WarehouseJob> {
    return this.service.update(id, data, req.user.id);
  }

  @Post(':id/post-to-income')
  postToIncome(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.service.postToIncome(id, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
