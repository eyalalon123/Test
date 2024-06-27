import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { loginDTO, registerDTO } from './DTO/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    @UsePipes(new ValidationPipe())
    register(@Body() user: registerDTO) {
        return this.authService.register(user);
    }

    @Post('/login')
    @UsePipes(new ValidationPipe())
    async login(@Res() res:Response, @Body() user: loginDTO) {
        await this.authService.login(res,user);
        res.send();
    }
}
