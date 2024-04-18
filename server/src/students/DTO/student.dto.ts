import { Type } from "class-transformer";
import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateTestDTO {

    @IsOptional()
    name?: string;

    @IsOptional()
    grade?: number
}

export class studentDTO {

    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateTestDTO)
    tests?: CreateTestDTO
}

export class updateStudentDTO {

    @IsString()
    name?: string;

    @ValidateNested()
    @Type(() => CreateTestDTO)
    tests?: CreateTestDTO
}