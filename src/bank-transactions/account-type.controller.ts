import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountTypeService } from './account-type.service';
import { CreateLookupDto } from './bank-transaction.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('account-types')
export class AccountTypeController {
  constructor(private readonly service: AccountTypeService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() data: CreateLookupDto, @Req() req) {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: CreateLookupDto, @Req() req) {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
