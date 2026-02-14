import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Post,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get Current User Profile',
    description: 'Retrieve the profile of the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update User Profile',
    description: "Update the authenticated user's profile information",
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      updateEmail: {
        summary: 'Update Email',
        value: {
          email: 'newemail@example.com',
        },
      },
      updatePassword: {
        summary: 'Update Password',
        value: {
          password: 'NewSecurePass123!',
        },
      },
      updateProfile: {
        summary: 'Update Full Profile',
        value: {
          name: 'John Updated',
          email: 'john.updated@example.com',
          address: '789 New Street, Boston, MA 02101',
          telephone: '+1-555-999-8888',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use',
  })
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.sub, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/upload-resume')
  @ApiBearerAuth('access-token')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf|docx|doc)$/)) {
          return cb(
            new Error('Only PDF, DOCX and DOC files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload Resume',
    description: 'Upload a resume file to the user profile (max 5MB)',
  })
  @ApiResponse({
    status: 201,
    description: 'Resume uploaded successfully',
    schema: {
      example: {
        message: 'Resume uploaded successfully',
        resumeUrl: 'https://cloudinary.com/...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file format or size',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async uploadResume(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.saveResume(req.user.sub, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User ID (MongoDB ObjectId)',
  })
  @ApiOperation({
    summary: 'Get User Profile by ID',
    description: 'Retrieve a user profile by their ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserProfile(@Param('userId') userId: string) {
    return this.usersService.getUserProfile(userId);
  }
}
