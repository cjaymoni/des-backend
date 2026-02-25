import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BankTransactionService } from './bank-transaction.service';
import {
  CreateBankTransactionDto, UpdateBankTransactionDto, SearchBankTransactionDto,
  CreateBankAccountDto, UpdateBankAccountDto,
} from './bank-transaction.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('bank-transactions')
@UseGuards(AuthGuard('jwt'))
export class BankTransactionController {
  constructor(private service: BankTransactionService) {}

  // ── Accounts ───────────────────────────────────────────────────────────────

  @Get('accounts')
  findAllAccounts() {
    return this.service.findAllAccounts();
  }

  @Get('accounts/:id')
  findOneAccount(@Param('id') id: string) {
    return this.service.findOneAccount(id);
  }

  @Post('accounts')
  createAccount(
    @Body() data: CreateBankAccountDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.service.createAccount(data, req.user.id);
  }

  @Put('accounts/:id')
  updateAccount(
    @Param('id') id: string,
    @Body() data: UpdateBankAccountDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.service.updateAccount(id, data, req.user.id);
  }

  @Delete('accounts/:id')
  deleteAccount(@Param('id') id: string) {
    return this.service.deleteAccount(id);
  }

  @Get('accounts/:acctNumber/summary')
  getSummary(@Param('acctNumber') acctNumber: string) {
    return this.service.getSummary(acctNumber);
  }

  // ── Transactions ───────────────────────────────────────────────────────────

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchBankTransactionDto,
  ) {
    return this.service.findAll(pagination, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreateBankTransactionDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateBankTransactionDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
