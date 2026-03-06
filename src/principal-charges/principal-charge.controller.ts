import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrincipalChargeService } from './principal-charge.service';
import { UpsertPrincipalChargeSetupDto } from './principal-charge.dto';
import { PrincipalChargeSetup } from './principal-charge-setup.entity';

@Controller('principal-charges')
@UseGuards(AuthGuard('jwt'))
export class PrincipalChargeController {
  constructor(private service: PrincipalChargeService) {}

  @Get()
  findAll(): Promise<PrincipalChargeSetup[]> {
    return this.service.findAll();
  }

  @Get(':principalId')
  findByPrincipal(@Param('principalId') principalId: string): Promise<PrincipalChargeSetup> {
    return this.service.findByPrincipal(principalId);
  }

  @Post()
  upsert(@Body() data: UpsertPrincipalChargeSetupDto, @Req() req: { user: { id: string } }): Promise<PrincipalChargeSetup> {
    return this.service.upsert(data, req.user.id);
  }

  @Delete(':principalId')
  delete(@Param('principalId') principalId: string): Promise<void> {
    return this.service.delete(principalId);
  }
}
