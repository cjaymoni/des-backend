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
import { CurrencyService } from './currency.service';
import {
  CreateCurrencyDto,
  UpdateCurrencyDto,
  SearchCurrencyDto,
} from './currency.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { Currency } from './currency.entity';

@Controller('currencies')
@UseGuards(AuthGuard('jwt'))
export class CurrencyController {
  constructor(private service: CurrencyService) {}

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchCurrencyDto,
  ): Promise<PaginatedResult<Currency>> {
    return this.service.findAll(pagination, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Currency> {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreateCurrencyDto,
    @Req() req: { user: { id: string } },
  ): Promise<Currency> {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateCurrencyDto,
    @Req() req: { user: { id: string } },
  ): Promise<Currency> {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
