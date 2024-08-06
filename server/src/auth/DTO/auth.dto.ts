import { IsNotEmpty, IsOptional, IsString, Matches, Length } from "class-validator";

export class registerDTO {

    @IsNotEmpty()
    @Length(3, 20)
    @Matches(/^[a-zA-Zא-ת]+$/, {
        message: 'Name must consist of English and/or Hebrew letters only'
    })
    name: string;

    @IsNotEmpty()
    @Length(10)
    @Matches(/^\d+$/, {
        message: "Phone number must be a 10 digit number"
    })
    phoneNumber: string

    @IsNotEmpty()
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/, {
        message: 'Password must include at least one uppercase letter, one lowercase letter and one number'
    })
    password: string
}

export class loginDTO {

    @IsNotEmpty()
    @IsString()
    phoneNumber: string

    @IsNotEmpty()
    @IsString()
    password: string
}