import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class studentDTO {

    @IsNotEmpty()
    name: string;

}

export class updateStudentDTO {

    @IsOptional()
    @IsString()
    name?: string;

}