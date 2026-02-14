import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @ApiProperty({ example: 'Software Engineer' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 'Job description here...' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: 120000 })
  @Prop()
  salary: number;

  @ApiProperty({ example: 'Remote / New York' })
  @Prop()
  location: string;

  @ApiProperty({ type: String, example: '65c123abc...' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  employerId: Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);
