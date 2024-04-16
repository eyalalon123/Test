import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose'
import { StudentsModule } from './students/students.module';
import { TestsModule } from './tests/tests.module';

@Module({
  imports: [
    TestsModule,
    StudentsModule,
    UsersModule,
    MongooseModule.forRoot("mongodb://127.0.0.1/nestjs_tutorial"),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
