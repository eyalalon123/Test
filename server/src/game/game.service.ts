import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AnswersDTO, CreateGameDTO } from './DTO/game.dto';
import { Category } from './shcemas/category.shcema';

@Injectable()
export class GameService {
    constructor(@InjectModel(Category.name) private gameModel: Model<Category>) { }

    createGame(game: CreateGameDTO) {
        const newGame = new this.gameModel(game);
        return newGame.save();
    }

    getAllData() {
        return this.gameModel.find();
    }

    getCategoryById(id: string) {
        return this.gameModel.findById(id)
    }

    async checkAnswers({ answers: givenAnswers, letter }: AnswersDTO) {
        try {
            const categorysAnswers: { answers: string[], _id: string }[] = await this.getAnswersByLetter(letter);
            return givenAnswers.map((givenAnswer) => {
                // find category answer by given answer id 
                const categoryAnswers = categorysAnswers.find(({ _id }) => givenAnswer.categoryId === _id.toString());

                // return if given answer exist in categoryAnswers
                return !!categoryAnswers?.answers.includes(givenAnswer.answer)
            })
        }
        catch (err) {
            console.log("Error while checkAnswers", err);
            throw err;
        }
    }

    async getAnswersByLetter(letter: string) {
        const aggregationResult = await this.gameModel.aggregate([
            // make the answers array of the all categroies be goal nefesh
            { $unwind: '$answers' },

            // filter the answers by given letter
            { $match: { 'answers.letter': letter } },

            // return only _id (by default) and categoryAnswers as 'answers'
            { $project: { answers: '$answers.categoryAnswers' } } // Project _id and categoryAnswers fields
        ]);

        if (aggregationResult.length > 0) return aggregationResult;
        throw new BadRequestException();
    }
}