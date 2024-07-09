import { Body, Controller, Delete, Get, HttpException, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { updateUserDTO, userDTO } from './DTO/user.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    creatUser(@Body() user: userDTO) {
        return this.userService.createUser(user);
    }

    @Get()
    getAllUsers() {
        return this.userService.getAllUsers()
    }

    @Get(':id')
    @UseGuards(AuthGuard)
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
