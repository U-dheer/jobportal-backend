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
        const userCount = await this.userModel.countDocuments();
        const jobCount = await this.jobModel.countDocuments();
        // For demo: just return counts. Expand as needed.
        return { userCount, jobCount };
    }
}
