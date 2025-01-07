import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';

require('dotenv').config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.enableCors({
    origin: [
      'http://localhost:5000',
      /^http:\/\/192\.168\.1\.\d+:5000$/,
      /^http:\/\/172\.20\.98\.\d+:5000$/,
    ],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe())

  app.use(cookieParser());
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
