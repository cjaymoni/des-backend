import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { winstonConfig } from './config/logger.config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });

  app.use(helmet());

  app.enableCors({
    // origin: (origin, callback) => {
    //   if (!origin) {
    //     callback(null, true);
    //     return;
    //   }

    //   const allowedPatterns: RegExp[] = [
    //     /^https?:\/\/([a-z0-9-]+\.)*optimumitsolutiongh\.com$/,
    //     /^http:\/\/localhost:3000$/,
    //     ...(process.env.ALLOWED_ORIGINS?.split(',').map(
    //       (o: string) =>
    //         new RegExp(`^${o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
    //     ) || []),
    //   ];

    //   if (allowedPatterns.some((pattern) => pattern.test(origin))) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error('Not allowed by CORS'));
    //   }
    // },
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-org-name'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const port = process.env.PORT || 5059;
  await app.listen(port, '0.0.0.0');

  winstonConfig.log(`Server running on http://localhost:${port}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
