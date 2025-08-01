import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

export enum ApplicationStatus {
    Applied = 'Applied',
    Viewed = 'Viewed',
    Rejected = 'Rejected',
}

@Schema({ timestamps: true })
export class Application {
    @Prop({ required: true, enum: ApplicationStatus })
    status: ApplicationStatus;

    @Prop()
    resumeUrl: string;

    @Prop()
    coverLetter: string;

    @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
    jobId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    jobSeekerId: Types.ObjectId;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application); 