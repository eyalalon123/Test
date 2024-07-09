import { IsNotEmpty, IsString } from 'class-validator';

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