import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.schema';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.JobSeeker })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Main St, New York, NY' })
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  telephone: string;
}
