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
import { BankTransactionService } from './bank-transaction.service';
import {
  CreateBankTransactionDto,
  UpdateBankTransactionDto,
  SearchBankTransactionDto,
  CreateBankAccountDto,
  UpdateBankAccountDto,
  CreateBankNameDto,
  UpdateBankNameDto,
  CreateLookupDto,
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

  @Get('accounts/:id/summary')
  getSummary(@Param('id') id: string) {
    return this.service.getSummary(id);
  }

  // ── Bank Names (BankSetup) ─────────────────────────────────────────────────

  @Get('bank-names')
  findAllBankNames() {
    return this.service.findAllBankNames();
  }

  @Post('bank-names')
  createBankName(
    @Body() data: CreateBankNameDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.service.createBankName(data, req.user.id);
  }

  @Put('bank-names/:id')
  updateBankName(
    @Param('id') id: string,
    @Body() data: UpdateBankNameDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.service.updateBankName(id, data, req.user.id);
  }

  @Delete('bank-names/:id')
  deleteBankName(@Param('id') id: string) {
    return this.service.deleteBankName(id);
  }

  // ── Bank Purposes ──────────────────────────────────────────────────────────

  @Get('purposes')
  findAllPurposes() {
    return this.service.findAllPurposes();
  }

  @Post('purposes')
  createPurpose(
    @Body() data: CreateLookupDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.service.createPurpose(data, req.user.id);
  }

  @Delete('purposes/:id')
  deletePurpose(@Param('id') id: string) {
    return this.service.deletePurpose(id);
  }

  // ── Finance Summary Report (RptxBank) ──────────────────────────────────────

  @Get('reports/finance-summary')
  getFinanceSummary(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.service.getFinanceSummary(dateFrom, dateTo);
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
