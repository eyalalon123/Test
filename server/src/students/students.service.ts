import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tests } from 'src/tests/schemas/tests.shcema';
import { studentDTO, updateStudentDTO } from './DTO/student.dto';
import { Students } from './schemas/student.shcema';

@Injectable()
export class studentsService {
    constructor(
        @InjectModel(Students.name) private readonly studentsModel: Model<Students>,
        @InjectModel(Tests.name) private testsModel: Model<Tests>
    ) { }


    async createStudent({ tests, ...studentDTO }: studentDTO) {
        if (tests) {
            const newTests = new this.testsModel(tests);
            const savedNewTests = await newTests.save();
            const newStudent = new this.studentsModel({
                ...studentDTO,
                tests: savedNewTests,
            })
            return newStudent.save();
        }
        const newStudent = new this.studentsModel(studentDTO);
        return newStudent.save();
    }

    getAllStudents() {
        return this.studentsModel.find().populate('tests');
    }

    getStudentById(id: string) {
        return this.studentsModel.findById(id).populate('tests');
    }

    updateStudent(id: string, updateStudentDTO: updateStudentDTO) {
        return this.studentsModel.findByIdAndUpdate(id, updateStudentDTO, { new: true })
    }

    deleteStudent(id: string) {
        return this.studentsModel.findByIdAndDelete(id)
    }
}
