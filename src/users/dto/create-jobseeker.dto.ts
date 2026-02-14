import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateJobSeekerDto {
    @IsArray()
    @IsString({ each: true })
    skills: string[];

    @IsArray()
    @IsString({ each: true })
    education: string[];

    @IsArray()
    @IsString({ each: true })
    experience: string[];

    @IsOptional()
    @IsString()
    resumeUrl?: string;
}