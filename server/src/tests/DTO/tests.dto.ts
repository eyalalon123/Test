import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class testsDTO {

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
    grade?: string;

}