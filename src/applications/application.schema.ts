import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

export enum ApplicationStatus {
  Applied = 'Applied',
  Viewed = 'Viewed',
  Rejected = 'Rejected',
}

@Schema({ timestamps: true })
export class Application {
  @ApiProperty({ enum: ApplicationStatus, example: ApplicationStatus.Applied })
  @Prop({ required: true, enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty({ example: 'https://cloudinary.com/resume.pdf' })
  @Prop()
  resumeUrl: string;

  @ApiProperty({ example: 'I am highly motivated...' })
  @Prop()
  coverLetter: string;

  @ApiProperty({ type: String, example: '65c123abc...' })
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @ApiProperty({ type: String, example: '65d456def...' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  jobSeekerId: Types.ObjectId;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
