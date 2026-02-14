import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { User } from './user.entity';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('company_admin')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto): Promise<PaginatedResult<Partial<User>>> {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Partial<User>> {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateUserDto): Promise<Partial<User>> {
    return this.usersService.create(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
  ): Promise<Partial<User>> {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
