import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { GameRoom, GameRoomSchema } from './schemas/game-room.schema';
import { GameRoomController } from './game-room.controller';
import { GameRoomService } from './game-room.service';

import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameRoom.name, schema: GameRoomSchema },
    ]),
    AuthModule
  ],
  controllers: [GameRoomController],
  providers: [GameRoomService]
})
export class GameRoomModule { }
