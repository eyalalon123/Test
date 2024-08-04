import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddNewWordDto, FixWordDto } from './DTO/tests.dto';
import { testsService } from './tests.service';

@Controller('api/tests')
export class testsController {

    constructor(private testsService: testsService) { }

    @Post('/add-word')
    // @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    addWord(@Body() addNewWord: AddNewWordDto) {
        return this.testsService.addWord(addNewWord);
    }

    @Post('/fix-word')
    // @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    fixWrongWord(@Body() fixWordDto: FixWordDto) {
        return this.testsService.fixWrongWord(fixWordDto);
    }

    @Get(':id')
    // @UseGuards(AuthGuard)
    async getWordById(@Param('id') id: string) {
        const findWord = await this.testsService.getWordById(id)
        if (!findWord) { throw new HttpException('word not found', 404) };
        return findWord;
    }

    // @Patch(':id')
    // @UseGuards(AuthGuard)
    // @UsePipes(new ValidationPipe())
    // updateTest(@Param('id') id: string, @Body() updateTestsDTO: updateTestsDTO) {
    //     return this.testsService.updateTest(id, updateTestsDTO)
    // }

    // @Delete(':id')
    // @UseGuards(AuthGuard)
    // deleteTest(@Param('id') id: string) {
    //     return this.testsService.deleteTest(id)
    // }
}
