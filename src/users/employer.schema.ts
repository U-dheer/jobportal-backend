import { Prop, Schema } from '@nestjs/mongoose';
import { User } from './user.schema';

@Schema()
export class Employer extends User {
    @Prop({ required: true })
    companyName: string;

    @Prop()
    contactInfo: string;
} 