import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { testsDTO, updateTestsDTO } from './DTO/tests.dto';
import { Tests } from './schemas/tests.shcema';

@Injectable()
export class testsService {
    constructor(@InjectModel(Tests.name) private readonly testsModel: Model<Tests>) { }


    createTest(testsDTO: testsDTO) {
        const newTest = new this.testsModel(testsDTO);
        return newTest.save();
    }

    getAllTests() {
        return this.testsModel.find()
    }

    getTestById(id: string) {
        return this.testsModel.findById(id)
    }

    updateTest(id: string, updateTestsDTO: updateTestsDTO) {
        return this.testsModel.findByIdAndUpdate(id, updateTestsDTO, { new: true })
    }

    deleteTest(id: string) {
        return this.testsModel.findByIdAndDelete(id)
    }
}
