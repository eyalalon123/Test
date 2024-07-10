import { Module } from '@nestjs/common';

import { GameGateway } from './game.gateway';

@Module({
    exports: [GameGateway],
    providers: [GameGateway]
})
export class GameGatewayModule { }
