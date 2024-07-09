import { Body, Controller, Get, HttpException, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AnswersDTO, CreateGameDTO } from './DTO/categories.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CategoriesService } from './categories.service';

@Controller('api/games')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    createGame(@Body() game: CreateGameDTO) {
        return this.categoriesService.createGame(game);
    }

    @Get()
    getAllUsers() {
        return this.categoriesService.getAllData()
    }

    @UseGuards(AuthGuard)
    @Post('submit')
    async submitAllAnswers(@Body() body: AnswersDTO) {
        try {
            return await this.categoriesService.checkAnswers(body);
        } catch (error) {
            throw new Error(`Error submitting answers: ${error.message}`);
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getUserById(@Param('id') id: string) {
        const findCategoryId = await this.categoriesService.getCategoryById(id)
        if (!findCategoryId) { throw new HttpException('category not found', 404) };
        return findCategoryId;
    }

}