import { Body, Controller, Get, Patch, UseGuards, Request, UseInterceptors, UploadedFile, Post, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req) {
        return this.usersService.getProfile(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateProfile(req.user.sub, updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('me/upload-resume')
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(pdf|docx|doc)$/)) {
                return cb(new Error('Only PDF, DOCX and DOC files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit
        },
    }))
    async uploadResume(@Request() req, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.saveResume(req.user.sub, file);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    async getUserProfile(@Param('userId') userId: string) {
        return this.usersService.getUserProfile(userId);
    }
}
