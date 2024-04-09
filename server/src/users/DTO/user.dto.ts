import { IsNotEmpty } from "class-validator";

export class usersDTO {

    _id: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    phoneNumber: string
}