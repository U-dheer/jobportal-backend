import {
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.schema';

export class UpdateUserDto {
  @ApiProperty({ example: 'newemail@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'newpassword123', minLength: 6, required: false })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsNotEmpty()
  telephone?: string;
}
