import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { TestsModule } from './tests/tests.module';
import { AuthModule } from './auth/auth.module';

import { GameRoomModule } from './game-room/game-room.module';
import { GameGatewayModule } from './game/game.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TestsModule,
    GameRoomModule,
    CategoriesModule,
    MongooseModule.forRoot("mongodb://127.0.0.1/nestjs_tutorial"),
  ],
  controllers: [AppController],
  providers: [AppService, GameGatewayModule],
})
export class AppModule { }
