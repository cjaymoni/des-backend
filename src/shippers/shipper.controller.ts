import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShipperService } from './shipper.service';
import { CreateShipperDto, UpdateShipperDto, SearchShipperDto } from './shipper.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { Shipper } from './shipper.entity';

@Controller('shippers')
@UseGuards(AuthGuard('jwt'))
export class ShipperController {
  constructor(private service: ShipperService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto, @Query() search: SearchShipperDto): Promise<PaginatedResult<Shipper>> {
    return this.service.findAll(pagination, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Shipper> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: CreateShipperDto, @Req() req: { user: { id: string } }): Promise<Shipper> {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateShipperDto, @Req() req: { user: { id: string } }): Promise<Shipper> {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
