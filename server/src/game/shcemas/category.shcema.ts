import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export class Letters {
    @Prop({ required: true })
    א: string[];

    @Prop({ required: true })
    ב: string[];

    @Prop({ required: true })
    ג: string[];

    @Prop({ required: true })
    ד: string[];

    @Prop({ required: true })
    ה: string[];

    @Prop({ required: true })
    ו: string[];

    @Prop({ required: true })
    ז: string[];

    @Prop({ required: true })
    ח: string[];

    @Prop({ required: true })
    ט: string[];

    @Prop({ required: true })
    י: string[];

    @Prop({ required: true })
    כ: string[];

    @Prop({ required: true })
    ל: string[];

    @Prop({ required: true })
    מ: string[];

    @Prop({ required: true })
    נ: string[];

    @Prop({ required: true })
    ס: string[];

    @Prop({ required: true })
    ע: string[];

    @Prop({ required: true })
    פ: string[];

    @Prop({ required: true })
    צ: string[];

    @Prop({ required: true })
    ק: string[];

    @Prop({ required: true })
    ר: string[];

    @Prop({ required: true })
    ש: string[];

    @Prop({ required: true })
    ת: string[];
}

@Schema({ versionKey: false })
export class Category {
    @Prop({ type: Letters})
    ארץ: Letters;

    @Prop({ type: Letters})
    עיר: Letters;

    @Prop({ type: Letters})
    חי: Letters;

    @Prop({ type: Letters})
    צומח: Letters;

    @Prop({ type: Letters})
    דומם: Letters;

    @Prop({ type: Letters})
    ילד: Letters;

    @Prop({ type: Letters})
    ילדה: Letters;

    @Prop({ type: Letters})
    מקצוע: Letters;

    @Prop({ type: Letters})
    מפורסם: Letters;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
