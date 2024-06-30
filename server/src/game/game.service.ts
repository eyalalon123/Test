import { Injectable, NotFoundException } from '@nestjs/common';
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

    getAllData() {
        return this.gameModel.find()
    }

    async findLetterInEretzById(categoryId: string, letter: string): Promise<string[]> {
        const category = await this.gameModel.findById(categoryId).exec();
        if (!category) {
            throw new NotFoundException(`Category with ID ${categoryId} not found`);
        }

        const letterData = category.ארץ[letter];
        if (!letterData) {
            throw new NotFoundException(`Letter ${letter} not found in ארץ`);
        }

        return letterData;
    }
}