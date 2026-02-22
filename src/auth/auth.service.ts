import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private tenantService: TenantService,
    @InjectConnection() private connection: Connection,
  ) {}

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: 'user' | 'company_admin' | 'system_admin',
  ): Promise<AuthResponseDto> {
    const hashedPassword = await bcrypt.hash(password, 10);

    // System admin registration (public schema) - only via internal method
    if (role === 'system_admin') {
      const user = this.connection.getRepository(User).create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'system_admin',
      });
      await this.connection.getRepository(User).save(user);
      return this.generateToken(user);
    }

    // Tenant user registration (user or company_admin only)
    return this.tenantService.withManager(async (manager) => {
      const user = manager.create(User, {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role === 'company_admin' ? 'company_admin' : 'user',
      });
      await manager.save(user);
      return this.generateToken(user);
    });
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    // Try system admin first (public schema)
    const systemUser = await this.connection.getRepository(User).findOne({ where: { email } });
    
    if (systemUser && systemUser.role === 'system_admin') {
      if (await bcrypt.compare(password, systemUser.password)) {
        const currentLogin = new Date();
        const previousLogin = systemUser.lastLogin || currentLogin;
        systemUser.lastLogin = currentLogin;
        await this.connection.getRepository(User).save(systemUser);
        const response = this.generateToken(systemUser);
        response.user.lastLogin = previousLogin;
        return response;
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    // Try tenant user
    return this.tenantService.withManager(async (manager) => {
      const user = await manager.findOne(User, { where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const currentLogin = new Date();
      const previousLogin = user.lastLogin || currentLogin;
      user.lastLogin = currentLogin;
      await manager.save(user);
      const response = this.generateToken(user);
      response.user.lastLogin = previousLogin;
      return response;
    });
  }

  private generateToken(user: User): AuthResponseDto {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        lastLogin: user.lastLogin || new Date(),
      },
    };
  }

  async getUserById(userId: string) {
    // Try system admin first (public schema)
    const systemUser = await this.connection.getRepository(User).findOne({ where: { id: userId } });
    if (systemUser && systemUser.role === 'system_admin') {
      const { password, ...userWithoutPassword } = systemUser;
      return userWithoutPassword;
    }

    // Try tenant user
    return this.tenantService.withManager(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}
