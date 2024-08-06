import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { GameRoom, GameRoomSchema } from './schemas/game-room.schema';
import { GameRoomController } from './game-room.controller';
import { GameRoomService } from './game-room.service';

import { AuthModule } from 'src/auth/auth.module';
import { GameGatewayModule } from 'src/game/game.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameRoom.name, schema: GameRoomSchema },
    ]),
    AuthModule,
    CategoriesModule,
    GameGatewayModule,
    ScheduleModule.forRoot()
  ],
  controllers: [GameRoomController],
  providers: [GameRoomService],
})
export class GameRoomModule { }
