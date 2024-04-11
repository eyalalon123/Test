import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { updateUserDTO, usersDTO } from './DTO/user.dto';
import { Users } from './schemas/user.shcema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(Users.name) private readonly UsersModel: Model<Users>) { }

    createUser(usersDTO: usersDTO) {
        const newUser = new this.UsersModel(usersDTO);
        return newUser.save();
    }

    getAllUsers() {
        return this.UsersModel.find()
    }

    getUserById(id: string) {
        return this.UsersModel.findById(id)
    }

    updateUser(id: string, updateUserDTO: updateUserDTO) {
        return this.UsersModel.findByIdAndUpdate(id, updateUserDTO, { new: true })
    }

    deleteUser(id: string) {
        return this.UsersModel.findByIdAndDelete(id)
    }
}
