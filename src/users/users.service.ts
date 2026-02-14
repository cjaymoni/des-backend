import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from './user.entity';
import { TenantContext } from '../tenant/tenant.context';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private connection: Connection,
    private tenantContext: TenantContext,
  ) {}

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<Partial<User>>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const [items, total] = await this.connection.getRepository(User).findAndCount({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt'],
      skip,
      take: limit,
    });
    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<Partial<User>> {
    const user = await this.connection.getRepository(User).findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: Partial<User>): Promise<Partial<User>> {
    const exists = await this.connection.getRepository(User).findOne({
      where: { email: data.email },
    });
    if (exists) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password!, 10);
    const user = this.connection.getRepository(User).create({
      ...data,
      password: hashedPassword,
    });
    await this.connection.getRepository(User).save(user);

    const { password, ...result } = user;
    return result;
  }

  async update(id: string, data: Partial<User>): Promise<Partial<User>> {
    const user = await this.connection.getRepository(User).findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, data);
    await this.connection.getRepository(User).save(user);

    const { password, ...result } = user;
    return result;
  }

  async delete(id: string): Promise<void> {
    const user = await this.connection.getRepository(User).findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.connection.getRepository(User).remove(user);
  }
}
