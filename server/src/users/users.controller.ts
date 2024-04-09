import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { usersDTO } from './DTO/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Get()
    getUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    getUser(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.getUser(userId);
    }

    @Post()
    addUser(@Body() newUser: usersDTO) {
        this.userService.addUser(newUser)
        return "Created !"
    }

    @Put(':id')
    updateUser(@Body() user: usersDTO, @Param('id') userId: number) {
        this.userService.updateUser(userId, user)
        return "updated !"
    }

    @Delete(':id')
    deleteUser(@Param('id') userId: number) {
        this.userService.deleteUser(userId)
        return "deleted !"
    }
}
