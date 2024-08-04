import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddNewWordDto, FixWordDto } from './DTO/tests.dto';
import { Tests } from './schemas/tests.shcema';

@Injectable()
export class testsService {
    constructor(@InjectModel(Tests.name) private readonly testsModel: Model<Tests>) { }

    addWord(addNewWord: AddNewWordDto) {
        const newWord = new this.testsModel(addNewWord);
        return newWord.save();
    }

    async fixWrongWord(fixWordDto: FixWordDto): Promise<Tests> {
        const { mistakeWord, correctedWord } = fixWordDto;

        const newTest = new this.testsModel({
            fixWord: [{ mistakeWord, correctedWord }]
        });
        return newTest.save();
    }

    getWordById(id: string) {
        return this.testsModel.findById(id)
    }

    // updateTest(id: string, updateTestsDTO: updateTestsDTO) {
    //     return this.testsModel.findByIdAndUpdate(id, updateTestsDTO, { new: true })
    // }

    // deleteTest(id: string) {
    //     return this.testsModel.findByIdAndDelete(id)
    // }
}
