import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class testsDTO {

    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    grade?: number;

}

export class updateTestsDTO {

    @IsString()
    name?: string;

    @IsNumber()
    grade?: number;

}