import { Body, Controller, Get, HttpException, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AnswersDTO, CreateGameDTO } from './DTO/game.dto';
import { AuthGuard } from 'src/auth/auth.guard';
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

    @UseGuards(AuthGuard)
    @Post('submit')
    async submitAllAnswers(@Body() body: AnswersDTO) {
        try {
            return await this.gameService.checkAnswers(body);
        } catch (error) {
            throw new Error(`Error submitting answers: ${error.message}`);
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getUserById(@Param('id') id: string) {
        const findCategoryId = await this.gameService.getCategoryById(id)
        if (!findCategoryId) { throw new HttpException('category not found', 404) };
        return findCategoryId;
    }

}