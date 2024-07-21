import { Body, Controller, Post } from '@nestjs/common';
import { GameRoomService } from './game-room.service';
import { CreateGameDTO, EndGameDTO, JoinGameDTO, NewRoundDTO } from './DTO/game-room.dto';

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

    @Post('/end-game')
    endGame(@Body() endGameDTO: EndGameDTO) {
        return this.gameRoomService.endGame(endGameDTO);
    }

    @Post('/new-round')
    newRound(@Body() newRoundDTO: NewRoundDTO) {
        return this.gameRoomService.newRound(newRoundDTO);
    }
}
