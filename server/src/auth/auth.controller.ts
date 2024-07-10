import { Body, Controller, Delete, Get, HttpException, NotFoundException, Param, ParseIntPipe, Patch, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { loginDTO, registerDTO } from './DTO/auth.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

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
    async login(@Res() res: Response, @Body() user: loginDTO) {
        const id = await this.authService.login(res, user);
        return res.send({ id });
    }

    @Get("/login-with-cookie")
    async loginWithCookie(@Req() req: Request) {
        return await this.authService.signInUserByToken(req.cookies?.token);
    }

    @Get(':username')
    async getUserByName(@Param('username') name: string) {
        return await this.authService.getUserIdByName(name)
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getUserById(@Param('id') id: string, @Req() req: Request) {
        const findUser = await this.authService.getUserById(id)
        if (!findUser) { throw new HttpException('user not found', 404) };
        return findUser;
    }
}