import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsNumber()
    salary?: number;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    employerId?: string;
} 