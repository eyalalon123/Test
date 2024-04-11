import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { updateUserDTO, usersDTO } from './DTO/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    creatUser(@Body() usersDTO: usersDTO) {
        return this.userService.createUser(usersDTO);
    }

    @Get()
    getAllUsers() {
        return this.userService.getAllUsers()
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        const findUser = await this.userService.getUserById(id)
        if (!findUser) { throw new HttpException('user not found', 404) };
        return findUser;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    updateUser(@Param('id') id: string, @Body() updateUserDTO: updateUserDTO) {
        return this.userService.updateUser(id, updateUserDTO)
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id)
    }
}
