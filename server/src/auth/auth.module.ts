import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema, Users } from './schemas/auth.schema'
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string | number>('JWT_EXPIRES'),
                },
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: Users.name, schema: UsersSchema },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, AuthGuard],
    exports: [AuthGuard, PassportModule, UsersService],
})
export class AuthModule { }
