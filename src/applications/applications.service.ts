import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument, ApplicationStatus } from './application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
    constructor(@InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>) { }

    async apply(userId: string, jobId: string, createApplicationDto: CreateApplicationDto) {
        const application = new this.applicationModel({
            ...createApplicationDto,
            jobId,
            jobSeekerId: userId,
            status: 'Applied',
        });
        await application.save();
        return application;
    }

    async findByJobSeeker(jobSeekerId: string) {
        return this.applicationModel.find({ jobSeekerId })
            .populate('jobId', 'title description salary location employerId')
            .exec();
    }

    async findJobsByJobSeeker(jobSeekerId: string) {
        return this.applicationModel.find({ jobSeekerId })
            .populate('jobId', 'title description salary location employerId')
            .exec();
    }

    async findByJob(jobId: string) {
        return this.applicationModel.find({ jobId })
            .populate('jobSeekerId', 'name email')
            .exec();
    }

    async deleteApplication(applicationId: string) {
        const application = await this.applicationModel.findByIdAndDelete(applicationId);
        if (!application) {
            throw new NotFoundException('Application not found');
        }
        return { message: 'Application deleted successfully' };
    }

    async updateApplicationStatus(applicationId: string, status: string) {
        const application = await this.applicationModel.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        ).populate('jobSeekerId', 'name email');

        if (!application) {
            throw new NotFoundException('Application not found');
        }
        return application;
    }
}
