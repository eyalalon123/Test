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

    getCategoryById(id: string) {
        return this.gameModel.findById(id)
    }

    async checkAnswer(id: string, answer: string, letter: string) {
        try {
            const categoryData = await this.gameModel.findById(id);

            if (!categoryData) {
                throw new Error(`Category data not found for ID ${id}`);
            }

            const categoryObject = categoryData.toObject();
            const categoryKeyName = Object.keys(categoryObject).find(key => key !== '_id');

            if (!categoryObject[categoryKeyName]) {
                throw new Error(`Category '${categoryKeyName}' not found in category data for ID ${id}`);
            }

            const answersArray = categoryObject[categoryKeyName][letter];

            if (!Array.isArray(answersArray)) {
                throw new Error(`Answers array not found for letter ${letter} in category '${categoryKeyName}'`);
            }

            const isCorrect = answersArray.includes(answer);

            return {
                answer,
                isCorrect,
                id
            };
        } catch (error) {
            throw new Error(`Error checking answer: ${error.message}`);
        }
    }

}