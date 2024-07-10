import { Body, Controller, Post } from '@nestjs/common';
import { GameRoomService } from './game-room.service';
import { CreateGameDTO, JoinGameDTO } from './DTO/game-room.dto';

@Controller('api/game-room')
export class GameRoomController {
    constructor(private readonly gameRoomService: GameRoomService) { }

    @Post()
    createGame(@Body() newGameData: CreateGameDTO) {
        return this.gameRoomService.createGame(newGameData);
    }

    @Post('/join-game')
    joinGame(@Body() joinGameData: JoinGameDTO) {
        return this.gameRoomService.joinGame(joinGameData);
    }

    // @Post('/start-game')
    // startGame(@Body() joinGameData: JoinGameDTO) {
    //     return this.gameRoomService.startGame(joinGameData);
    // }
}
