import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'User Registration',
    description: 'Register a new user (JobSeeker, Employer, or Admin)',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data',
    examples: {
      jobseeker: {
        summary: 'JobSeeker Registration',
        value: {
          email: 'john.doe@example.com',
          password: 'SecurePass123!',
          role: 'JobSeeker',
          name: 'John Doe',
          address: '123 Main St, New York, NY 10001',
          telephone: '+1-555-123-4567',
        },
      },
      employer: {
        summary: 'Employer Registration',
        value: {
          email: 'hr@techcorp.com',
          password: 'SecurePass123!',
          role: 'Employer',
          name: 'Jane Smith',
          address: '456 Business Ave, San Francisco, CA 94105',
          telephone: '+1-555-987-6543',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: { message: 'Registration successful' },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email already registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User Login',
    description: 'Login with email and password to get JWT token',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful - JWT token provided',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '507f1f77bcf86cd799439011',
          email: 'user@example.com',
          role: 'JobSeeker',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}
