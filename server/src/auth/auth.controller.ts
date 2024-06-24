import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { loginDTO, registerDTO } from './DTO/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/register')
    @UsePipes(new ValidationPipe())
    register(@Body() user: registerDTO): Promise<{ token: string }> {
        return this.authService.register(user);
    }

    @Post('/login')
    @UsePipes(new ValidationPipe())
    login(@Body() user: loginDTO): Promise<{ token: string }> {
        return this.authService.login(user);
    }
}
