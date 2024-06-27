import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from  './app.module';
import * as cookieParser from 'cookie-parser';

require('dotenv').config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.enableCors({
    origin: "http://localhost:5000",
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe())

  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();
