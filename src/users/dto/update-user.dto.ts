import { IsEmail, IsEnum, IsOptional, MinLength, IsNotEmpty } from 'class-validator';
import { UserRole } from '../user.schema';

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @MinLength(6)
    password?: string;

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