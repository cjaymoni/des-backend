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

  private async findPublicUser(field: 'email' | 'id', value: string): Promise<User | null> {
    const col = field === 'email' ? 'email' : 'id';
    const rows: User[] = await this.connection.query(
      `SELECT * FROM public.users WHERE "${col}" = $1 LIMIT 1`,
      [value],
    );
    return rows[0] ?? null;
  }

  private async savePublicUser(user: User): Promise<void> {
    await this.connection.query(
      `UPDATE public.users SET "lastLogin" = $1 WHERE id = $2`,
      [user.lastLogin, user.id],
    );
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: 'user' | 'company_admin' | 'system_admin',
  ): Promise<AuthResponseDto> {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'system_admin') {
      const rows: User[] = await this.connection.query(
        `INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, 'system_admin', true, NOW(), NOW())
         RETURNING *`,
        [email, hashedPassword, firstName, lastName],
      );
      return this.generateToken(rows[0]);
    }

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
    const systemUser = await this.findPublicUser('email', email);

    if (systemUser && systemUser.role === 'system_admin') {
      if (!(await bcrypt.compare(password, systemUser.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const currentLogin = new Date();
      const previousLogin = systemUser.lastLogin || currentLogin;
      systemUser.lastLogin = currentLogin;
      await this.savePublicUser(systemUser);
      const response = this.generateToken(systemUser);
      response.user.lastLogin = previousLogin;
      return response;
    }

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
    const systemUser = await this.findPublicUser('id', userId);
    if (systemUser && systemUser.role === 'system_admin') {
      const { password, ...userWithoutPassword } = systemUser;
      return userWithoutPassword;
    }

    return this.tenantService.withManager(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}
