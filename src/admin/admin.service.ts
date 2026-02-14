import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Job, JobDocument } from '../jobs/job.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    ) { }

    async getAllUsers() {
        try {
            console.log('Fetching all users...');
            const users = await this.userModel.find({}, { password: 0 }).exec();
            console.log('Found users:', users.length);

            const mappedUsers = users.map(user => {
                // Handle companyName for employers
                let displayName = user.name;
                if (user.role === 'Employer' && (user as any).companyName) {
                    displayName = (user as any).companyName;
                }

                return {
                    _id: user._id,
                    name: displayName || 'Unknown',
                    email: user.email,
                    role: user.role,
                    telephone: user.telephone || 'N/A',
                    address: user.address || 'N/A',
                    isActive: user.isActive !== false,
                    createdAt: (user as any).createdAt,
                    updatedAt: (user as any).updatedAt
                };
            });

            console.log('Mapped users:', mappedUsers);
            return mappedUsers;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async suspendUser(userId: string) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { isActive: false },
            { new: true }
        );
        if (!user) throw new NotFoundException('User not found');

        return {
            message: "User suspended successfully",
            userId: user._id,
            isActive: false
        };
    }

    async activateUser(userId: string) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { isActive: true },
            { new: true }
        );
        if (!user) throw new NotFoundException('User not found');

        return {
            message: "User activated successfully",
            userId: user._id,
            isActive: true
        };
    }

    async deleteUser(userId: string) {
        const user = await this.userModel.findByIdAndDelete(userId);
        if (!user) throw new NotFoundException('User not found');
        return { message: 'User deleted' };
    }

    async usageReport() {
        try {
            console.log('Generating usage report...');

            const totalUsers = await this.userModel.countDocuments();
            const totalJobs = await this.jobModel.countDocuments();

            // Get actual user statistics
            const activeUsers = await this.userModel.countDocuments({ isActive: true });
            const suspendedUsers = await this.userModel.countDocuments({ isActive: false });
            const jobSeekers = await this.userModel.countDocuments({ role: 'JobSeeker' });
            const employers = await this.userModel.countDocuments({ role: 'Employer' });

            // Mock data for demo purposes - in production, these would come from actual system metrics
            const totalApplications = Math.floor(totalJobs * 2.5); // Mock: average 2.5 applications per job
            const totalMessages = Math.floor(totalUsers * 1.2); // Mock: average 1.2 messages per user

            // Mock system stats
            const systemStats = {
                uptime: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
                memoryUsage: `${Math.floor(Math.random() * 40) + 30}%`, // 30-70%
                cpuUsage: `${Math.floor(Math.random() * 30) + 10}%`, // 10-40%
            };

            const report = {
                totalUsers,
                totalJobs,
                totalApplications,
                totalMessages,
                activeUsers,
                suspendedUsers,
                jobSeekers,
                employers,
                systemStats
            };

            console.log('Generated report:', report);
            return report;
        } catch (error) {
            console.error('Error generating usage report:', error);
            throw error;
        }
    }
}
