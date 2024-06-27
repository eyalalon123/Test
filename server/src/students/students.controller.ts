import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { studentDTO, updateStudentDTO } from './DTO/student.dto';
import { studentsService } from './students.service';

@Controller('api/students')
export class studentsController {

    constructor(private studentservice: studentsService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    createStudent(@Body() studentsDTO: studentDTO) {
        return this.studentservice.createStudent(studentsDTO);
    }

    @Get()
    getAllStudents() {
        return this.studentservice.getAllStudents()
    }

    @Get(':id')
    async getStudentById(@Param('id') id: string) {
        const findStudent = await this.studentservice.getStudentById(id)
        if (!findStudent) { throw new HttpException('user not found', 404) };
        return findStudent;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    updateStudent(@Param('id') id: string, @Body() updateStudentDTO: updateStudentDTO) {
        return this.studentservice.updateStudent(id, updateStudentDTO)
    }

    @Delete(':id')
    deleteStudent(@Param('id') id: string) {
        return this.studentservice.deleteStudent(id)
    }
}
