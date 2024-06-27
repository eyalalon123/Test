import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Tests, TestSchema } from './schemas/tests.shcema';
import { testsController } from './tests.controller';
import { testsService } from './tests.service';


@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: Tests.name, schema: TestSchema },
        ]),
    ],
    controllers: [testsController],
    providers: [testsService],
})
export class TestsModule { }
