import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

const categoryName = ['ארץ', 'עיר', 'חי', 'צומח', 'דומם', 'ילד', 'ילדה', 'מקצוע', 'מפורסם'];
type CategoryName = 'ארץ' | 'עיר' | 'חי' | 'צומח' | 'דומם' | 'ילד' | 'ילדה' | 'מקצוע' | 'מפורסם';

const letters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];
type Letters = 'א' | 'ב' | 'ג' | 'ד' | 'ה' | 'ו' | 'ז' | 'ח' | 'ט' | 'י' | 'כ' | 'ל' | 'מ' | 'נ' | 'ס' | 'ע' | 'פ' | 'צ' | 'ק' | 'ר' | 'ש' | 'ת';

@Schema({ _id: false })
export class Answers extends Document {
    @Prop({ required: true, enum: letters })
    letter: Letters;

    @Prop({ type: [String] })
    categoryAnswers: string[];
}

@Schema({ versionKey: false })
export class Category extends Document {
    @Prop({ type: String, enum: categoryName, required: true })
    name: CategoryName;

    @Prop({ type: [Answers], required: true })
    answers: Answers[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);