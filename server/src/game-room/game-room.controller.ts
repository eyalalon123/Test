import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GameRoomService } from './game-room.service';
import { CreateGameDTO, EndGameDTO, JoinGameDTO, MessageDTO, NewRoundDTO } from './DTO/game-room.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/game-room')
export class GameRoomController {
    constructor(private readonly gameRoomService: GameRoomService) { }

    @Post()
    @UseGuards(AuthGuard)
    createGame(@Body() newGameData: CreateGameDTO) {
        return this.gameRoomService.createGame(newGameData);
    }

    @Post('/join-game')
    @UseGuards(AuthGuard)
    joinGame(@Body() joinGameData: JoinGameDTO) {
        return this.gameRoomService.joinGame(joinGameData);
    }

    @Post('/end-game')
    @UseGuards(AuthGuard)
    endGame(@Body() endGameDTO: EndGameDTO) {
        return this.gameRoomService.endGame(endGameDTO);
    }

    @Post('/new-round')
    @UseGuards(AuthGuard)
    newRound(@Body() newRoundDTO: NewRoundDTO) {
        return this.gameRoomService.newRound(newRoundDTO);
    }

    @Post('/new-message')
    @UseGuards(AuthGuard)
    newMessage(@Body() message: MessageDTO) {
        return this.gameRoomService.sendMessage(message);
    }

    @Get('/get-chat/:gameId')
    @UseGuards(AuthGuard)
    getChat(@Param('gameId') gameId: string) {
        return this.gameRoomService.getChat(gameId);
    }
}
