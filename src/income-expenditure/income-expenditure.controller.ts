import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomeExpenditureService } from './income-expenditure.service';
import {
  CreateIncomeExpenditureDto,
  UpdateIncomeExpenditureDto,
  SearchIncomeExpenditureDto,
} from './income-expenditure.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { IncomeExpenditure } from './income-expenditure.entity';

@Controller('income-expenditures')
@UseGuards(AuthGuard('jwt'))
export class IncomeExpenditureController {
  constructor(private service: IncomeExpenditureService) {}

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchIncomeExpenditureDto,
  ): Promise<PaginatedResult<IncomeExpenditure>> {
    return this.service.findAll(pagination, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IncomeExpenditure> {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreateIncomeExpenditureDto,
    @Req() req: { user: { id: string } },
  ): Promise<IncomeExpenditure> {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateIncomeExpenditureDto,
    @Req() req: { user: { id: string } },
  ): Promise<IncomeExpenditure> {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
