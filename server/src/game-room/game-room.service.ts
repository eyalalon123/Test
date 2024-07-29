import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';

import { CategoriesService } from 'src/categories/categories.service';
import { AuthService } from 'src/auth/auth.service';
import { GameGateway } from 'src/game/game.gateway';

import { Answers, CreateGameDTO, EndGameDTO, JoinGameDTO, MessageDTO, NewRoundDTO } from './DTO/game-room.dto';
import { GameRoom, GameStatusEnum, Message, Result } from './schemas/game-room.schema';

@Injectable()
export class GameRoomService {
    constructor(
        @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoom>,
        private readonly gameGateway: GameGateway,
        private readonly authService: AuthService,
        private readonly categoriesService: CategoriesService,

    ) { }

    async createGame(createGameData: CreateGameDTO) {
        try {
            const { opponentName, playerId } = createGameData;
            const opponentId = await this.authService.getUserIdByName(opponentName);

            const newGameData = {
                idP1: playerId,
                idP2: opponentId,
                gameStatus: GameStatusEnum.Pending,
            }
            const user1 = await this.authService.getUserById(playerId);
            const createdName = user1.user.name

            // create new game object 
            const newGame = new this.gameRoomModel(newGameData);

            // save the new game in the db
            const createdGame = await newGame.save();

            // send invitation to the opponent
            this.gameGateway.sendInvitation(opponentId.toString(), createdGame._id, createdName)

        }
        catch (err) {
            console.log('Error trying to create game: ', err);
            throw err;
        }
    }

    async joinGame(joinGameData: JoinGameDTO) {
        const { gameId } = joinGameData;
        const hebrewLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];
        const randomIndex = Math.floor(Math.random() * hebrewLetters.length);
        const randomLetter = hebrewLetters[randomIndex];

        const updatedGame = await this.gameRoomModel.findByIdAndUpdate(gameId, { gameStatus: GameStatusEnum.InProgress }, { new: true })
        this.gameGateway.startGame(updatedGame.idP1, updatedGame.idP2, gameId, randomLetter)
    }

    async endGame(endGameDTO: EndGameDTO) {

        const { gameId, playerId, answers, letter } = endGameDTO;


        try {
            // get results 
            const playerResults = await this.getResults(answers, letter)
            const rightAnswers = playerResults.filter((answer: boolean) => answer)
            const score = rightAnswers.length * 10;

            // get game room
            const gameRoom = await this.gameRoomModel.findById(gameId);
            const { idP1, idP2, results } = gameRoom;

            const user1 = await this.authService.getUserById(idP1);
            const createdName = user1.user.name
            const user2 = await this.authService.getUserById(idP2);
            const invitedName = user2.user.name

            // if data missing throw error
            if (!gameRoom) throw new BadRequestException('Game room not found');
            if (!this.checkPlayerInGame(playerId, idP1, idP2))
                throw new BadRequestException('Player not found in this game room');

            // define last result for update stats
            if (results.length === 0) results.push({} as Result)
            let lastResult = results[results.length - 1];

            // update the result object inside results[]
            const resultsFor = playerId === idP1 ? 'resultsP1' : 'resultsP2'
            this.updateResult(results, resultsFor, score)

            // if they both ends the game send socket 
            lastResult = results[results.length - 1];
            if (lastResult.resultsP1 !== undefined && lastResult.resultsP2 !== undefined) {
                gameRoom.gameStatus = GameStatusEnum.GameOver;
                this.gameGateway.endGame(idP1, idP2, gameId, lastResult.resultsP1, lastResult.resultsP2, createdName, invitedName)
            }

            // update the game room with the new results
            await this.gameRoomModel.findByIdAndUpdate(gameId, gameRoom, { new: true });

            return { results: playerResults, score };
        } catch (error) {
            console.error('Error updating game results:', error);
            throw error;
        }
    }

    checkPlayerInGame(playerId: string, idP1: string, idP2: string): boolean {
        return !(playerId !== idP1 && playerId !== idP2)
    }

    async getResults(answers: Answers[], letter: string) {
        return await this.categoriesService.checkAnswers({ answers, letter });
    }

    updateResult(results: Result[], resultFor: "resultsP1" | "resultsP2", score: number) {
        const lastResult = results[results.length - 1];

        if (lastResult[resultFor]) {
            if (!lastResult[resultFor === "resultsP1" ? "resultsP2" : "resultsP1"]) throw new BadRequestException('Results are sent already.')
            results.push({ [resultFor]: score })
        }
        else lastResult[resultFor] = score;
    }

    async newRound(newRoundDTO: NewRoundDTO) {
        try {
            const { opponentId, gameId, playerId } = newRoundDTO;

            const user1 = await this.authService.getUserById(playerId);
            const createdName = user1.user.name

            await this.gameRoomModel.findByIdAndUpdate(gameId, {
                $push: { results: {} },
            });

            // send invitation to the opponent
            this.gameGateway.sendInvitation(opponentId.toString(), gameId, createdName)
        }
        catch (err) {
            console.log('Error trying to create game: ', err);
            throw err;
        }
    }

    async sendMessage(sendMessageDTO: MessageDTO) {
        const { gameId, senderId, receiverId, text, date: dateString } = sendMessageDTO;
        const date = new Date(dateString)

        // Create a new message object
        const message = {
            senderId,
            text,
            timestamp: date
        } as Message;

        // Add the message to the game's chat array
        await this.gameRoomModel.findByIdAndUpdate(gameId, {
            $push: { chat: message }
        });

        // Notify both players about the new message
        this.gameGateway.handleChatMessage(text, receiverId, gameId, date);

        return message;
    }

    async getChat(gameId: string) {
        // Retrieve messages from the game's chat array
        const gameRoom = await this.gameRoomModel.findById(gameId).select('chat');

        if (!gameRoom) throw new BadRequestException('Game room not found');
        return gameRoom.chat;
    }
}