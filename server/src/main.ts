import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

require('dotenv').config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.enableCors({

    origin: "*",
  });
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(8000);
}
bootstrap();
