import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGameDTO } from './DTO/game.dto';
import { Category } from './shcemas/category.shcema';

@Injectable()
export class GameService {
    constructor(@InjectModel(Category.name) private gameModel: Model<Category>) { }

    createGame(game: CreateGameDTO) {
        const newGame = new this.gameModel(game);
        return newGame.save();
    }

    // async updateCatagory(id: string, updateUserDTO: updateUserDTO) {
    //     const existingPhoneNumber = await this.UsersModel.findOne({ phoneNumber: updateUserDTO.phoneNumber });

    //     if (existingPhoneNumber && existingPhoneNumber._id.toString() !== id) {
    //         throw new Error('Phone number already exists');
    //     }
    //     return await this.UsersModel.findByIdAndUpdate(id, updateUserDTO, { new: true });
    // }

    getAllData() {
        return this.gameModel.find()
    }

}