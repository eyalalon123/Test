import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { updateUserDTO, userDTO } from './DTO/user.dto';
import { Users } from './schemas/user.shcema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(Users.name) private readonly UsersModel: Model<Users>) { }

    async createUser(user: userDTO) {
        try {
            // Check for unique phone number
            const isExist = await this.UsersModel.findOne({ phoneNumber: user.phoneNumber });
            if (isExist) throw new BadRequestException('User with the same phone number already exists');

            const newUser = new this.UsersModel(user);
            return newUser.save();
        } catch (error) {
            throw new BadRequestException('User with the same phone number already exists');
        }
    }

    getAllUsers() {
        return this.UsersModel.find()
    }

    getUserById(id: string) {
        return this.UsersModel.findById(id)
    }

    async updateUser(id: string, updateUserDTO: updateUserDTO) {
        const existingPhoneNumber = await this.UsersModel.findOne({ phoneNumber: updateUserDTO.phoneNumber });

        if (existingPhoneNumber && existingPhoneNumber._id.toString() !== id) {
            throw new Error('Phone number already exists');
        }
        return await this.UsersModel.findByIdAndUpdate(id, updateUserDTO, { new: true });
    }


    deleteUser(id: string) {
        return this.UsersModel.findByIdAndDelete(id)
    }
}
