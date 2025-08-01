import { Prop, Schema } from '@nestjs/mongoose';
import { User } from './user.schema';

@Schema()
export class JobSeeker extends User {
    @Prop([String])
    skills: string[];

    @Prop([String])
    education: string[];

    @Prop([String])
    experience: string[];
} 