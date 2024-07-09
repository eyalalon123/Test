import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { CreateGameDTO, JoinGameDTO } from './DTO/game-room.dto';
import { GameRoom, GameStatusEnum } from './schemas/game-room.schema';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GameRoomService {
    constructor(
        @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoom>,
        private readonly authService: AuthService
    ) { }

    async createGame(createGameData: CreateGameDTO) {
        const { opponentName, playerId } = createGameData;
        const opponentId = await this.authService.getUserByName(opponentName);

        const newGameData = {
            idP1: playerId,
            idP2: opponentId,
            gameStatus: GameStatusEnum.Pending,
        }
        const newGame = new this.gameRoomModel(newGameData);
        await newGame.save();

        // send socket to both 
        // this.gameGateway.notifyPlayers([playerId, opponentId], 'gameCreated', newGame);

    }

    async joinGame(joinGameData: JoinGameDTO) {
        const { gameId, playerId } = joinGameData;
        await this.gameRoomModel.findByIdAndUpdate(gameId, { idP2: playerId, gameStatus: GameStatusEnum.InProgress })

        // send socket to both
        // this.gameGateway.notifyPlayers([updatedGame.idP1, playerId], 'gameStarted', updatedGame);

    }
}