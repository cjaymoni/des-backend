import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { User } from './user.entity';
import { TenantService } from '../tenant/tenant.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private tenantService: TenantService) {}

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResult<Partial<User>>> {
    return this.tenantService.withManager(async (manager) => {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      const [items, total] = await manager.getRepository(User).findAndCount({
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'role',
          'isActive',
          'createdAt',
        ],
        skip,
        take: limit,
      });
      return {
        items,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    });
  }

  async findOne(id: string): Promise<Partial<User>> {
    return this.tenantService.withManager(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id },
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'role',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });
      if (!user) throw new NotFoundException('User not found');
      return user;
    });
  }

  async create(data: Partial<User>): Promise<Partial<User>> {
    return this.tenantService.withManager(async (manager) => {
      const hashedPassword = await bcrypt.hash(data.password!, 10);
      const user = manager.getRepository(User).create({
        ...data,
        password: hashedPassword,
      });
      await manager.getRepository(User).save(user);

      const { password, ...result } = user;
      return result;
    });
  }

  async update(id: string, data: Partial<User>): Promise<Partial<User>> {
    return this.tenantService.withManager(async (manager) => {
      const user = await manager.getRepository(User).findOne({ where: { id } });
      if (!user) throw new NotFoundException('User not found');

      Object.assign(user, data);
      await manager.getRepository(User).save(user);

      const { password, ...result } = user;
      return result;
    });
  }

  async delete(id: string): Promise<void> {
    await this.tenantService.withManager(async (manager) => {
      const user = await manager.getRepository(User).findOne({ where: { id } });
      if (!user) throw new NotFoundException('User not found');
      await manager.getRepository(User).remove(user);
    });
  }
}
