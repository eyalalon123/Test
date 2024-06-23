import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class usersDTO {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    phoneNumber: string

    @IsNotEmpty()
    password: string
}

export class updateUserDTO {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string

    @IsOptional()
    @IsString()
    password?: string
}