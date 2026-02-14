import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { ServiceResponseDto } from '../common/dto/service-response.dto';

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
      body.role,
    );
  }

  @Post('register-system-admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('system_admin')
  async registerSystemAdmin(@Body() body: Omit<RegisterDto, 'role'>): Promise<AuthResponseDto> {
    return this.authService.register(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
      'system_admin',
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(body.email, body.password);
  }
}
