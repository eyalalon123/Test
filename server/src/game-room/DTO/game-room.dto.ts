import { IsArray, IsNotEmpty, IsString, IsDateString } from 'class-validator';

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

export class MessageDTO {
    @IsString()
    @IsNotEmpty()
    gameId: string;

    @IsString()
    senderId: string;

    @IsString()
    receiverId: string;

    @IsString()
    text: string;

    @IsDateString()
    date: string;
}

export class GetUserGamesResultsDTO {
    @IsString()
    @IsNotEmpty()
    playerId: string;
}