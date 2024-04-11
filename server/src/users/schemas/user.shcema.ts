import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Users {

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    phoneNumber: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
