import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDTO {
    @IsString()
    @IsNotEmpty()
    playerId: string;

    @IsString()
    @IsNotEmpty()
    opponentName: string;
}

export class JoinGameDTO {
    @IsString()
    @IsNotEmpty()
    playerId: string;

    @IsString()
    @IsNotEmpty()
    gameId: string;
}

export type Answers = {
    categoryId: string,
    answer: string
}

export class EndGameDTO {
    @IsString()
    @IsNotEmpty()
    playerId: string;

    @IsString()
    @IsNotEmpty()
    gameId: string;

    @IsString()
    @IsNotEmpty()
    letter: string;

    @IsArray()
    answers: Answers[];
}

export class NewRoundDTO {
    @IsString()
    @IsNotEmpty()
    playerId: string;

    @IsString()
    @IsNotEmpty()
    opponentId: string;

    @IsString()
    @IsNotEmpty()
    gameId: string;
}