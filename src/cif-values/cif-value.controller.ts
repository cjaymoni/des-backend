import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CifValueService } from './cif-value.service';
import { UpsertCifSettingsDto, CreateCifValueDto, UpdateCifValueDto } from './cif-value.dto';

@Controller('cif-values')
@UseGuards(AuthGuard('jwt'))
export class CifValueController {
  constructor(private service: CifValueService) {}

  // ── Settings ───────────────────────────────────────────────────────────────

  @Get('settings')
  getSettings() {
    return this.service.getSettings();
  }

  @Post('settings')
  upsertSettings(
    @Body() data: UpsertCifSettingsDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.service.upsertSettings(data, req.user.id);
  }

  // ── Line items ─────────────────────────────────────────────────────────────

  @Get()
  findByRefNo(@Query('refNo') refNo: string) {
    return this.service.findByRefNo(refNo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreateCifValueDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateCifValueDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.service.update(id, data, req.user.id);
  }

  @Delete('ref/:refNo')
  deleteByRefNo(@Param('refNo') refNo: string) {
    return this.service.deleteByRefNo(refNo);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
