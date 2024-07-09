import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


export enum GameStatusEnum {
    Pending = "PENDING",
    InProgress = "IN_PROGRESS",
    GameOver = "GAME_OVER"
}

@Schema({ versionKey: false })
export class GameRoom {

    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    idP1: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    idP2: string;

    @Prop({ enum: GameStatusEnum })
    gameStatus: string;

    @Prop({ type: [String] })
    results: string[];
}

export const GameRoomSchema = SchemaFactory.createForClass(GameRoom);