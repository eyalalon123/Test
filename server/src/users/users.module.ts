import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema, Users } from './schemas/user.shcema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Users.name, schema: UsersSchema },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule { }
