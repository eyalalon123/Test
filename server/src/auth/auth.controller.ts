import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { loginDTO, registerDTO } from './DTO/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/register')
    register(@Body() user: registerDTO): Promise<{ token: string }> {
        return this.authService.register(user);
    }

    @Get('/login')
    login(@Body() user: loginDTO): Promise<{ token: string }> {
        return this.authService.login(user);
    }

    @Get()
    getAllUsers() {
        return this.authService.getAllUsers()
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        const findUser = await this.authService.getUserById(id)
        if (!findUser) { throw new HttpException('user not found', 404) };
        return findUser;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    updateUser(@Param('id') id: string, @Body() loginDTO: loginDTO) {
        return this.authService.updateUser(id, loginDTO)
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.authService.deleteUser(id)
    }
}
