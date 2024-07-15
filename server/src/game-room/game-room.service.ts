import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { CreateGameDTO, JoinGameDTO } from './DTO/game-room.dto';
import { GameRoom, GameStatusEnum } from './schemas/game-room.schema';
import { AuthService } from 'src/auth/auth.service';
import { GameGateway } from 'src/game/game.gateway';

@Injectable()
export class GameRoomService {
    constructor(
        @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoom>,
        private readonly gameGateway: GameGateway,
        private readonly authService: AuthService
    ) { }

    async createGame(createGameData: CreateGameDTO) {
        try {
            const { opponentName, playerId } = createGameData;
            const opponentId = await this.authService.getUserIdByName(opponentName);

            const newGameData = {
                idP1: playerId,
                idP2: null,
                gameStatus: GameStatusEnum.Pending,
            }

            // create new game object 
            const newGame = new this.gameRoomModel(newGameData);

            // save the new game in the db
            const createdGame = await newGame.save();

            // send invitation to the opponent
            this.gameGateway.sendInvitation(opponentId.toString(), createdGame._id)

        }
        catch (err) {
            console.log('Error trying to create game: ', err);
            throw err;
        }
    }

    async joinGame(joinGameData: JoinGameDTO) {
        const { gameId, playerId } = joinGameData;
        const updatedGame = await this.gameRoomModel.findByIdAndUpdate(gameId, { idP2: playerId, gameStatus: GameStatusEnum.InProgress }, { new: true })
        this.gameGateway.startGame(updatedGame.idP1, updatedGame.idP2, gameId)
    }
}