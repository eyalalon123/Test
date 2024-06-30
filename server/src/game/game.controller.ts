import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateGameDTO } from './DTO/game.dto';
import { GameService } from './game.service';

@Controller('api/games')
export class GameController {
    constructor(private readonly gameService: GameService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    createGame(@Body() game: CreateGameDTO) {
        return this.gameService.createGame(game);
    }

    @Get()
    getAllUsers() {
        return this.gameService.getAllData()
    }

    @Get(':id/:letter')
    async getLetterInEretz(@Param('id') id: string, @Param('letter') letter: string) {
        return this.gameService.findLetterInEretzById(id, letter);
    }
}