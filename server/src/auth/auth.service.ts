import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';

import { registerDTO, loginDTO } from './DTO/auth.dto';
import { Users } from './schemas/auth.schema';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(@InjectModel(Users.name)
    private readonly AuthModule: Model<Users>,
        private JwtService: JwtService
    ) { }

    async register(registerDTO: registerDTO) {
        const { name, phoneNumber, password } = registerDTO
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.AuthModule.create({
            name,
            phoneNumber,
            password: hashedPassword
        })
        return true
    }

    async login(res: Response, loginDTO: loginDTO) {
        const { phoneNumber, password } = loginDTO

        const user = await this.AuthModule.findOne({ phoneNumber })
        if (!user) throw new UnauthorizedException('Invalid phone number or password');

        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched) throw new UnauthorizedException('Invalid phone number or password');

        const token = this.JwtService.sign({ id: user._id, }, {
            secret: 'nisim'
        })
        res.cookie('token', token, {
            maxAge: 1000 * 60 * 60 * 8 // 8 hours in ms
        })
        return res;
    }
}
