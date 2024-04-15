import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Students, StudentsSchema } from './schemas/student.shcema';
import { studentsController } from './students.controller';
import { studentsService } from './students.service';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Students.name, schema: StudentsSchema },
        ]),
    ],
    controllers: [studentsController],
    providers: [studentsService],
})
export class StudentsModule { }
