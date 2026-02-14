import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Software Engineer' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'We are looking for a Node.js expert...' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 120000, required: false })
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiProperty({ example: 'Remote', required: false })
  @IsOptional()
  @IsString()
  location?: string;
}
