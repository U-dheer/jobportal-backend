import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmployerDto {
    @IsNotEmpty()
    @IsString()
    companyName: string;

    @IsOptional()
    @IsString()
    contactInfo?: string;
} 