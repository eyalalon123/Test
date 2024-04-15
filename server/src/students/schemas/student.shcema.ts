import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Students {

    @Prop({ type: String, required: true })
    name: string;

}

export const StudentsSchema = SchemaFactory.createForClass(Students);
