import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:5000',
        credentials: true,
    },
})

export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('GameGateway');

    constructor() { }

    afterInit() {
        this.logger.log('WebSocket Gateway initialized');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        // const gameId = this.clientGameMap.get(client.id);
        // if (gameId) {
        //   this.removePlayerFromGame(client.id, gameId);
        //   this.sendSocket(gameId, 'playerDisconnected', client.id);
        // }
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
        client.join(room);
        this.server.to(room).emit('message', `${client.id} has joined the room ${room}`);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, room: string) {
        client.leave(room);
        this.server.to(room).emit('message', `${client} has left the room ${room}`);
    }

    sendSocket(playerId: string, event: string, payload: Record<string, any> | string) {
        this.logger.log(`Send socket to room-${playerId}`);

        this.server.to(`room-${playerId}`).emit(event, payload)
    }

    sendInvitation(opponentId: string, gameId: string) {
        this.logger.log(`Invite ${opponentId} to game `);

        this.sendSocket(opponentId, "invitation-for-game", { gameId })
    }

    startGame(player1: string, player2: string, gameId: string, randomLetter: string) {
        this.logger.log(`Starting game with ${player1} vs ${player2}`);

        this.sendSocket(player1, "start-game", { gameId, randomLetter, opponentId: player2 });
        this.sendSocket(player2, "start-game", { gameId, randomLetter, opponentId: player1 })
    }

    endGame(player1: string, player2: string, gameId: string, resultsP1: number, resultsP2: number) {
        this.logger.log(`Ending game with ${player1} vs ${player2}`);

        this.sendSocket(player1, "end-game", { gameId, resultsP2, resultsP1, player2 });
        this.sendSocket(player2, "end-game", { gameId, resultsP1, resultsP2, player1 })
    }
}
