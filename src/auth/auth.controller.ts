import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
    );
  }

  @Post('register-company-admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('system_admin')
  async registerCompanyAdmin(
    @Body() body: RegisterDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
      'company_admin',
    );
  }

  @Post('register-system-admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('system_admin')
  async registerSystemAdmin(
    @Body() body: RegisterDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
      'system_admin',
    );
  }

  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Request() req: { headers: Record<string, string> },
  ): Promise<AuthResponseDto> {
    const orgName = req.headers['x-org-name'];
    return this.authService.login(body.email, body.password, orgName);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@Request() req: { user: { id: string } }) {
    return this.authService.getUserById(req.user.id);
  }
}
