import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3002', 
      'http://localhost:3005', 
      'http://76.13.15.98:3002',
      'https://egyptiancyclingobservatory.com',
      'https://www.egyptiancyclingobservatory.com'
    ],
    credentials: true,
  });

  // Increase payload limits for large files and form data
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
