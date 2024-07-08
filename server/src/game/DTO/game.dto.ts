import { IsArray, IsNotEmpty, IsString, ValidateNested, } from 'class-validator';
import { Category } from '../shcemas/category.shcema';

export class CreateGameDTO {
    categories: Category;
}

export class AnswersDTO {

    @IsArray()
    answers: { categoryId: string, answer: string }[];

    @IsString()
    @IsNotEmpty()
    letter: string
}