import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class testsDTO {

    @IsNotEmpty()
    name: string;

    @IsNumber()
    grade: number;

}

export class updateTestsDTO {

    @IsString()
    name?: string;

    @IsNumber()
    grade?: string;

}