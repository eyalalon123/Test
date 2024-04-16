import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Tests } from "src/tests/schemas/tests.shcema";

@Schema({ versionKey: false })
export class Students {

    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: Object, ref: 'Tests', required: false })
    tests?: Tests;
}

export const StudentsSchema = SchemaFactory.createForClass(Students);
