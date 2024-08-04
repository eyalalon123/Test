import { IsOptional, IsString } from "class-validator";

export class FixWordDto {
    @IsString()
    mistakeWord: string;

    @IsString()
    correctedWord: string;
}

export class AddNewWordDto {
    @IsOptional()
    @IsString()
    _id: string;

    @IsString()
    newWord: string;
}