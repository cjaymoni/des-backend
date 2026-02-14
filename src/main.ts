import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { winstonConfig } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });

  app.enableCors({
    origin: ['http://localhost:3000', /\.vercel\.app$/],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 6000;
  await app.listen(port);
  winstonConfig.log(`Server running on http://localhost:${port}`);
}
bootstrap();
