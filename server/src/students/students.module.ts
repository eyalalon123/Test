import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tests, TestSchema } from 'src/tests/schemas/tests.shcema';
import { AuthModule } from 'src/auth/auth.module';
import { Students, StudentsSchema } from './schemas/student.shcema';
import { studentsController } from './students.controller';
import { studentsService } from './students.service';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Students.name, schema: StudentsSchema },
            { name: Tests.name, schema: TestSchema }
        ]),
        AuthModule
    ],
    controllers: [studentsController],
    providers: [studentsService],
})
export class StudentsModule { }
