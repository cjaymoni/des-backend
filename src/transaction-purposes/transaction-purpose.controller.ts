import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionPurposeService, TransactionPurposeDto } from './transaction-purpose.service';

@UseGuards(AuthGuard('jwt'))
@Controller('transaction-purposes')
export class TransactionPurposeController {
  constructor(private readonly service: TransactionPurposeService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() data: TransactionPurposeDto, @Req() req) {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<TransactionPurposeDto>, @Req() req) {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
