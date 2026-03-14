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
import { PrincipalService } from './principal.service';
import {
  CreatePrincipalDto,
  UpdatePrincipalDto,
  SearchPrincipalDto,
} from './principal.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { Principal } from './principal.entity';

@Controller('principals')
@UseGuards(AuthGuard('jwt'))
export class PrincipalController {
  constructor(private service: PrincipalService) {}

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchPrincipalDto,
  ): Promise<PaginatedResult<Principal>> {
    return this.service.findAll(pagination, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Principal> {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreatePrincipalDto,
    @Req() req: { user: { id: string } },
  ): Promise<Principal> {
    return this.service.create(data, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdatePrincipalDto,
    @Req() req: { user: { id: string } },
  ): Promise<Principal> {
    return this.service.update(id, data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
