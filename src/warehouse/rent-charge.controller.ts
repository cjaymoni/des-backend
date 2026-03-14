import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RentChargeService } from './rent-charge.service';
import { CreateRentChargeDto, UpdateRentChargeDto } from './rent-charge.dto';
import { RentCharge } from './entities/rent-charge.entity';

@Controller('warehouse/rent-charges')
@UseGuards(AuthGuard('jwt'))
export class RentChargeController {
  constructor(private readonly service: RentChargeService) {}

  @Get()
  findAll(): Promise<RentCharge[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<RentCharge> {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreateRentChargeDto,
    @Req() req: { user: { id: string } },
  ): Promise<RentCharge> {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateRentChargeDto,
    @Req() req: { user: { id: string } },
  ): Promise<RentCharge> {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
