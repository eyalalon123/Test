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


    async createStudent(student: studentDTO) {
        const { tests } = student;
        if (tests) {
            const newTests = new this.testsModel(tests);
            const test = await newTests.save();
            student.tests = test;
        }
        const newStudent = new this.studentsModel(student);
        return newStudent.save();
    }

    getAllStudents() {
        return this.studentsModel.find().populate('tests');
    }

    getStudentById(id: string) {
        return this.studentsModel.findById(id).populate('tests');
    }

    async updateStudent(id: string, updateStudentDTO: updateStudentDTO) {
        const { tests, ...updateData } = updateStudentDTO;

        if (tests) {
            await this.studentsModel.findByIdAndUpdate(
                id,
                { $set: tests },
                { new: true }
            );
        }
        const updatedStudent = await this.studentsModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).populate('tests');
        return updatedStudent;
    }

    deleteStudent(id: string) {
        return this.studentsModel.findByIdAndDelete(id)
    }
}
