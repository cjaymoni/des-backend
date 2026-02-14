import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class AdminService {
  constructor(@InjectConnection() private connection: Connection) {}

  async getAllCompanies(pagination: PaginationDto): Promise<PaginatedResult<Company>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const [items, total] = await this.connection.getRepository(Company).findAndCount({
      skip,
      take: limit,
    });
    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getAllUsers(pagination: PaginationDto): Promise<PaginatedResult<Partial<User>>> {
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

  async getStats(): Promise<{ companyCount: number; userCount: number }> {
    const [companyCount, userCount] = await Promise.all([
      this.connection.getRepository(Company).count(),
      this.connection.getRepository(User).count(),
    ]);

    return { companyCount, userCount };
  }
}
