import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Get()
    getUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    getUser(@Param('id') userId: number) {
        return this.userService.getUser(userId);
    }
}
