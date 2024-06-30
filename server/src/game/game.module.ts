import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Category, CategorySchema } from './shcemas/category.shcema';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
        ]),
    ],
    controllers: [GameController],
    providers: [GameService],
})
export class GameModule { }
