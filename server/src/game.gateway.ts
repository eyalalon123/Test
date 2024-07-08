import {
    SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthService } from './auth/auth.service';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:5000',
        credentials: true,
    },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('GameGateway');
    private players: { [key: string]: Socket } = {};
    private gameStarted: boolean = false;

    constructor(private readonly authService: AuthService) { }

    afterInit(server: Server) {
        this.logger.log('WebSocket Gateway initialized');
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        // Remove disconnected client from players object
        for (const username in this.players) {
            if (this.players[username].id === client.id) {
                delete this.players[username];
                break;
            }
        }
    
        // If game is started and there's less than 2 players, end the game
        if (this.gameStarted && Object.keys(this.players).length < 2) {
            this.endGame();
        }
    }
    

    @SubscribeMessage('joinGame')
    async handleJoinGame(client: Socket, payload: { username: string }) {
        try {
            const userExists = await this.authService.getUserByName(payload.username);
            if (!userExists) {
                throw new Error('User does not exist');
            }

            // Add the player to the players object
            this.players[payload.username] = client;

            // Check if there are two players and start the game
            if (Object.keys(this.players).length === 2 && !this.gameStarted) {
                const [player1, player2] = Object.keys(this.players);
                this.startGame(player1, player2);
            }
        } catch (error) {
            client.emit('joinError', { error: error.message });
        }
    }

    startGame(player1: string, player2: string) {
        this.gameStarted = true;
        this.logger.log(`Starting game with ${player1} vs ${player2}`);

        // Emit 'gameStarted' event to both players with opponent information
        this.players[player1].emit('gameStarted', { opponent: player2 });
        this.players[player2].emit('gameStarted', { opponent: player1 });
    }

    endGame() {
        this.gameStarted = false;

        // Send game ended event to both players
        for (const player in this.players) {
            this.players[player].emit('gameEnded');
        }

        // Clear players and any other game-related data
        this.players = {};
    }

}
