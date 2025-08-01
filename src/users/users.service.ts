import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../common/cloudinary.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private cloudinaryService: CloudinaryService
    ) { }

    async getProfile(userId: string) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
        const update: any = {};
        if (updateUserDto.email) update.email = updateUserDto.email;
        if (updateUserDto.password) {
            const saltRounds = 10;
            update.password = await bcrypt.hash(updateUserDto.password, saltRounds);
        }
        if (updateUserDto.name) update.name = updateUserDto.name;
        if (updateUserDto.address) update.address = updateUserDto.address;
        if (updateUserDto.telephone) update.telephone = updateUserDto.telephone;
        if (updateUserDto.role) update.role = updateUserDto.role;

        try {
            const user = await this.userModel.findByIdAndUpdate(userId, update, { new: true }).select('-password');
            if (!user) throw new NotFoundException('User not found');
            return user;
        } catch (err) {
            if (err.code === 11000 && err.keyPattern?.email) {
                throw new ConflictException('Email already in use');
            }
            throw err;
        }
    }

    async saveResume(userId: string, file: Express.Multer.File) {
        try {
            // Upload file to Cloudinary
            const cloudinaryUrl = await this.cloudinaryService.uploadFile(file);

            // Save the Cloudinary URL to user's profile
            const user = await this.userModel.findByIdAndUpdate(
                userId,
                { resumeUrl: cloudinaryUrl },
                { new: true }
            ).select('-password');

            if (!user) throw new NotFoundException('User not found');

            return {
                message: 'Resume uploaded successfully',
                resumeUrl: cloudinaryUrl
            };
        } catch (error) {
            throw new Error(`Failed to upload resume: ${error.message}`);
        }
    }
}
