import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { studentDTO, updateStudentDTO } from './DTO/student.dto';
import { Students } from './schemas/student.shcema';

@Injectable()
export class studentsService {
    constructor(@InjectModel(Students.name) private readonly studentsModel: Model<Students>) { }


    createStudent(studentDTO: studentDTO) {
        const newStudent = new this.studentsModel(studentDTO);
        return newStudent.save();
    }

    getAllStudents() {
        return this.studentsModel.find()
    }

    getStudentById(id: string) {
        return this.studentsModel.findById(id)
    }

    updateStudent(id: string, updateStudentDTO: updateStudentDTO) {
        return this.studentsModel.findByIdAndUpdate(id, updateStudentDTO, { new: true })
    }

    deleteStudent(id: string) {
        return this.studentsModel.findByIdAndDelete(id)
    }
}
