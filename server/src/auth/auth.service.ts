import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';

import { registerDTO, loginDTO } from './DTO/auth.dto';
import { Users } from './schemas/auth.shcema';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(@InjectModel(Users.name)
    private readonly AuthModule: Model<Users>,
        private JwtService: JwtService
    ) { }

    async register(registerDTO: registerDTO): Promise<{ token: string }> {
        const { name, phoneNumber, password } = registerDTO
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.AuthModule.create({
            name,
            phoneNumber,
            password: hashedPassword
        })
        const token = this.JwtService.sign({ id: user._id })
        return { token }
    }

    async login(loginDTO: loginDTO): Promise<{ token: string }> {
        const { phoneNumber, password } = loginDTO

        const user = await this.AuthModule.findOne({ phoneNumber })
        if (!user) throw new UnauthorizedException('Invalid phone number or password');

        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched) throw new UnauthorizedException('Invalid phone number or password');

        const token = this.JwtService.sign({ id: user._id })
        return { token }
    }
}
