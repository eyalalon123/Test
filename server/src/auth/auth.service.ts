import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
        const { name, phoneNumber, password } = registerDTO;

        const hashedPassword = await bcrypt.hash(password, 10);

        const isExist = await this.AuthModule.findOne({ name: name });
        if (isExist) {
            throw new BadRequestException('User with the same name already exists');
        }

        const isPhoneNumberExist = await this.AuthModule.findOne({ phoneNumber: phoneNumber });
        if (isPhoneNumberExist) {
            throw new BadRequestException('User with the same phoneNumber already exists');
        }

        try {
            await this.AuthModule.create({
                name,
                phoneNumber,
                password: hashedPassword
            });
            return true;
        } catch (error) {
            throw new InternalServerErrorException('Error creating user');
        }
    }

    async login(res: Response, loginDTO: loginDTO) {
        const { phoneNumber, password } = loginDTO

        const user = await this.AuthModule.findOne({ phoneNumber })
        if (!user) throw new UnauthorizedException('Invalid phone number or password');

        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched) throw new UnauthorizedException('Invalid phone number or password');

        const token = this.JwtService.sign({ id: user._id, });

        res.cookie('token', token, {
            maxAge: parseFloat(process.env.JWT_EXPIRES.replace("d", "")) * 24 * 60 * 60 * 1000
        })
        return user._id;
    }

    async getUserIdByName(name: string) {
        const username = await this.AuthModule.findOne({ name });
        return username._id
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
