import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific configuration
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://project-management-client-three.vercel.app',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Start the server
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
