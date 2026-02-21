import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { winstonConfig } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });

  app.enableCors({
    origin: ['http://acme.localhost:3000', /\.vercel\.app$/],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 5059;
  await app.listen(port, '0.0.0.0');

  winstonConfig.log(`Server running on http://localhost:${port}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
