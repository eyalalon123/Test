import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


export enum GameStatusEnum {
    Pending = "PENDING",
    InProgress = "IN_PROGRESS",
    GameOver = "GAME_OVER"
}

export class Result {
    resultsP1?: number
    resultsP2?: number
}

export class Message {
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    senderId: string;

    @Prop({ type: String })
    text: string;

    @Prop({ type: Date, default: undefined })
    timestamp: Date;
}

@Schema({ versionKey: false })
export class GameRoom {

    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: string;

    @Prop({ type: String })
    idP1: string;

    @Prop({ type: String })
    idP2: string;

    @Prop({ enum: GameStatusEnum })
    gameStatus: GameStatusEnum;

    @Prop({ type: [Result] })
    results: Result[];

    @Prop({ type: [Message] })
    chat: Message[];
}
export const GameRoomSchema = SchemaFactory.createForClass(GameRoom);