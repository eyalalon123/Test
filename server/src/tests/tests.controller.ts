import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { testsDTO, updateTestsDTO } from './DTO/tests.dto';
import { testsService } from './tests.service';

@Controller('api/tests')
export class testsController {

    constructor(private testsService: testsService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    createTest(@Body() testsDTO: testsDTO) {
        return this.testsService.createTest(testsDTO);
    }

    @Get()
    @UseGuards(AuthGuard)
    getAlltests() {
        return this.testsService.getAllTests()
    }

    @Get(':id')
    async getTestById(@Param('id') id: string) {
        const findTest = await this.testsService.getTestById(id)
        if (!findTest) { throw new HttpException('user not found', 404) };
        return findTest;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    updateTest(@Param('id') id: string, @Body() updateTestsDTO: updateTestsDTO) {
        return this.testsService.updateTest(id, updateTestsDTO)
    }

    @Delete(':id')
    deleteTest(@Param('id') id: string) {
        return this.testsService.deleteTest(id)
    }
}
