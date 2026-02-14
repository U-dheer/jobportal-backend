import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  JobSeeker = 'JobSeeker',
  Employer = 'Employer',
  Admin = 'Admin',
}

@Schema({ discriminatorKey: 'role', timestamps: true })
export class User {
  @ApiProperty({ example: 'user@example.com' })
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @ApiProperty({ enum: UserRole })
  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @ApiProperty({
    example: 'https://cloudinary.com/resume.pdf',
    required: false,
  })
  @Prop()
  resumeUrl?: string;

  @ApiProperty({ example: 'John Doe' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: '123 Main St, New York, NY' })
  @Prop({ required: true })
  address: string;

  @ApiProperty({ example: '+1-555-0199' })
  @Prop({ required: true })
  telephone: string;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
