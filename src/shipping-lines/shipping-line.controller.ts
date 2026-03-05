import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShippingLineService } from './shipping-line.service';
import { CreateShippingLineDto, UpdateShippingLineDto, SearchShippingLineDto } from './shipping-line.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { ShippingLine } from './shipping-line.entity';

@Controller('shipping-lines')
@UseGuards(AuthGuard('jwt'))
export class ShippingLineController {
  constructor(private service: ShippingLineService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto, @Query() search: SearchShippingLineDto): Promise<PaginatedResult<ShippingLine>> {
    return this.service.findAll(pagination, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ShippingLine> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: CreateShippingLineDto, @Req() req: { user: { id: string } }): Promise<ShippingLine> {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateShippingLineDto, @Req() req: { user: { id: string } }): Promise<ShippingLine> {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
