import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Tests {

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: Number })
    grade: number;
}

export const TestSchema = SchemaFactory.createForClass(Tests);
