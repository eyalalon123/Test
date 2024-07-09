import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CategoriesModule } from './categories/categories.module';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { TestsModule } from './tests/tests.module';
import { AuthModule } from './auth/auth.module';

import { GameGateway } from './game.gateway';
import { GameRoomModule } from './game-room/game-room.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TestsModule,
    StudentsModule,
    GameRoomModule,
    CategoriesModule,
    MongooseModule.forRoot("mongodb://127.0.0.1/nestjs_tutorial"),
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway],
})
export class AppModule { }
