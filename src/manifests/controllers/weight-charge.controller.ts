import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WeightChargeService } from '../services/weight-charge.service';
import { WeightCharge } from '../entities/weight-charge.entity';

@Controller('manifests/charges')
@UseGuards(AuthGuard('jwt'))
export class WeightChargeController {
  constructor(private service: WeightChargeService) {}

  @Get()
  findAll(): Promise<WeightCharge[]> {
    return this.service.findAll();
  }

  @Post()
  create(@Body() data: { weightFrom: number; weightTo: number; charges: number }): Promise<WeightCharge> {
    return this.service.create(data.weightFrom, data.weightTo, data.charges);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
