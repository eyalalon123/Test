import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export class FixWord {
    mistakeWord: string;
    correctedWord: string;
}

@Schema({ versionKey: false })
export class Tests {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id?: mongoose.Types.ObjectId;

    @Prop({ type: String, require: true })
    newWord: string;

    @Prop({ type: [FixWord] })
    fixWord: FixWord[];
}

export const TestSchema = SchemaFactory.createForClass(Tests);
