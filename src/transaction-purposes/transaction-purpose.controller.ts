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
import {
  TransactionPurposeService,
  TransactionPurposeDto,
  TransactionPurposeDetailService,
  TransactionPurposeDetailDto,
} from './transaction-purpose.service';

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
  update(
    @Param('id') id: string,
    @Body() data: Partial<TransactionPurposeDto>,
    @Req() req,
  ) {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

@UseGuards(AuthGuard('jwt'))
@Controller('transaction-purpose-details')
export class TransactionPurposeDetailController {
  constructor(private readonly service: TransactionPurposeDetailService) {}

  @Get(':purposeCode')
  findByPurpose(@Param('purposeCode') purposeCode: string) {
    return this.service.findByPurpose(purposeCode);
  }

  @Post()
  create(@Body() data: TransactionPurposeDetailDto, @Req() req) {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<TransactionPurposeDetailDto>,
    @Req() req,
  ) {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
