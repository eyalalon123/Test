import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class Users {

    @Prop({ type: String, required: true})
    name: string;

    @Prop({ type: String, required: true, unique: true })
    phoneNumber: string;

    @Prop({ type: String, required: true})
    password: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
