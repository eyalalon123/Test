import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { loginDTO, registerDTO } from './DTO/auth.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';

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
        await this.authService.login(res, user);
        return res.send();
    }

    @Get()
    getAllUsers() {
        return this.authService.getAllUsers()
    }

    @Get("/login-with-cookie")
    async loginWithCookie(@Req() req: Request) {
        return await this.authService.signInUserByToken(req.cookies?.token);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getUserById(@Param('id') id: string, @Req() req: Request) {
        const findUser = await this.authService.getUserById(id)
        if (!findUser) { throw new HttpException('user not found', 404) };
        return findUser;
    }

}

    // const fetchUser = async () => {
    //     try {
    //         const cookies: Record<string, string> = document.cookie.split(";").map(v => v.split("=")
    //         ).reduce((acc, [key, val]) => ({ [key]: val, ...acc }), {});

    //         if (cookies.token) {
    //             // const { exp, id } = jwtDecode<Record<"id" | "exp", string>>(cookies.token);
    //             // if (!id || !exp || parseInt(exp) < Date.now() / 1000) return navigate("/login");
    //             const response = await axios.get(`login-with-cookie`, {
    //                 withCredentials: true,
    //             });
    //             return response.data;
    //         } else {
    //             navigate("/login");
    //         }
    //     } catch (error) {
    //         if (axios.isAxiosError(error) && error.response?.status === 401) {
    //             navigate('/login');
    //         }
    //         throw error;
    //     }
    // };