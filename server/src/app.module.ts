import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose'
import { StudentsModule } from './students/students.module';
import { TestsModule } from './tests/tests.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { GameGateway } from './game.gateway';

@Module({
  imports: [
    TestsModule,
    StudentsModule,
    UsersModule,
    GameModule,
    AuthModule,
    MongooseModule.forRoot("mongodb://127.0.0.1/nestjs_tutorial"),
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway],
})
export class AppModule { }
