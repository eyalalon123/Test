import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { updateUserDTO, usersDTO } from './DTO/user.dto';
import { Users } from './schemas/user.shcema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(Users.name) private readonly UsersModel: Model<Users>) { }


    async createUser(usersDTO: usersDTO) {
        try {
            const phoneNumberRegex = /^\d{10}$/;

            if (!phoneNumberRegex.test(usersDTO.phoneNumber)) {
                throw new Error("Phone number must be 10 digits and consist only of numbers");
            }

            const existingPhoneNumber = await this.UsersModel.findOne({ phoneNumber: usersDTO.phoneNumber });

            if (existingPhoneNumber) {
                throw new Error("User with the same phone number already exists");
            } else {
                const newUser = new this.UsersModel(usersDTO);
                return newUser.save();
            }
        } catch (error) {
            throw error;
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
