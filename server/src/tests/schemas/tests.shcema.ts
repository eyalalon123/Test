import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ versionKey: false })
export class Tests {

    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: string;

    @Prop({ type: String })
    name?: string;

    @Prop({ type: Number })
    grade?: number;
}

export const TestSchema = SchemaFactory.createForClass(Tests);
