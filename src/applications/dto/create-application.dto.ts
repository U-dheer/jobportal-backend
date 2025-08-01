import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../application.schema';

export class CreateApplicationDto {
    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;

    @IsOptional()
    @IsString()
    resumeUrl?: string;

    @IsOptional()
    @IsString()
    coverLetter?: string;

    @IsNotEmpty()
    @IsString()
    jobId: string;

    @IsNotEmpty()
    @IsString()
    jobSeekerId: string;
} 