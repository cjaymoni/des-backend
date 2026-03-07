import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = dataSource.getRepository(User).create({
    email: 'admin@system.com',
    password: hashedPassword,
    firstName: 'System',
    lastName: 'Admin',
    role: 'system_admin',
  });

  await dataSource.getRepository(User).save(user);
  console.log('System admin created: admin@system.com / admin123');

  await app.close();
}

bootstrap();
