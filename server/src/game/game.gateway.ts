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

        // handle player disconnected
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

    sendSocket(playerId: string, event: string, ...args: any[]) {
        this.server.to(`room-${playerId}`).emit(event, ...args)
    }

    sendInvitation(opponentId: string, gameId: string) {
        this.sendSocket(opponentId, "invitation-for-game", [{ gameId }])
    }


    startGame(player1: string, player2: string, gameId: string) {
        this.logger.log(`Starting game with ${player1} vs ${player2}`);

        this.sendSocket(player1, player2, "start-game", [{ gameId }])
    }

    // endGame() {
    // }

}
