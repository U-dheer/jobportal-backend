import { IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
    @IsOptional()
    @IsString()
    resumeUrl?: string;

    @IsOptional()
    @IsString()
    coverLetter?: string;
} 