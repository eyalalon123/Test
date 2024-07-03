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
        //bcrypt is a very easy-to-hack library with a low security standart, recomended to use something else (NS)
        const hashedPassword = await bcrypt.hash(password, 10)

        await this.AuthModule.create({
            name,
            phoneNumber,
            password: hashedPassword
        })

        //where is your error handleing?!?!?
        //it is not recomended to keep the user in a vaiable, just dont declare it for security reasons (NS)
        return true
    }

    async login(res: Response, loginDTO: loginDTO) {
        const { phoneNumber, password } = loginDTO

        const user = await this.AuthModule.findOne({ phoneNumber })
        if (!user) throw new UnauthorizedException('Invalid phone number or password');

        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched) throw new UnauthorizedException('Invalid phone number or password');

        //better, shorter, and a more scaleable solution below (NS)
        // if(!user || !(await bcrypt.compare(password, user.password))) {
        //     throw new UnauthorizedException('Invalid phone number or password');
        // }

        const token = this.JwtService.sign({ id: user._id, });

        //don't call the token cookie 'token', it is too easy for hackers to know to steel this cookie (NS)
        res.cookie('token', token, {
            maxAge: parseFloat(process.env.JWT_EXPIRES.replace("d", "")) * 24 * 60 * 60 * 1000
        })
    }

    getAllUsers() {
        //You are returning the passwords of all your users, you are aware of that? (NS)
        return this.AuthModule.find()
    }

    async getUserById(id: string) {
        //Make sure to omit the password from here aswell... perhaps use a middleware that makes sure that you never
        //accidently return passwords to the user.... (NS)
        return { user: await this.AuthModule.findById(id) }
    }

    async signInUserByToken(token?: string) {
        try {
            if (!token) throw null;
            this.JwtService.verify(token);
        } catch (e) {
            throw new UnauthorizedException("Bad token");
        }

        const { id } = this.JwtService.decode(token);

        return await this.getUserById(id);
    }
}
