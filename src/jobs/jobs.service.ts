import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
    constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) { }

    async create(employerId: string, createJobDto: CreateJobDto) {
        const job = new this.jobModel({ ...createJobDto, employerId });
        await job.save();
        return job;
    }

    async findAll(query: any) {
        // Simple search by title/location
        const filter: any = {};
        if (query.title) filter.title = { $regex: query.title, $options: 'i' };
        if (query.location) filter.location = { $regex: query.location, $options: 'i' };
        return this.jobModel.find(filter)
            .populate('employerId', 'name email')
            .exec();
    }

    async findOne(id: string) {
        const job = await this.jobModel.findById(id)
            .populate('employerId', 'name email')
            .exec();
        if (!job) throw new NotFoundException('Job not found');
        return job;
    }

    async findByEmployer(employerId: string) {
        return this.jobModel.find({ employerId })
            .populate('employerId', 'name email')
            .exec();
    }

    async updateJob(employerId: string, jobId: string, updateJobDto: UpdateJobDto) {
        const job = await this.jobModel.findById(jobId);
        if (!job) {
            throw new NotFoundException('Job not found');
        }

        if (job.employerId.toString() !== employerId) {
            throw new ForbiddenException('You can only update your own jobs');
        }

        const updatedJob = await this.jobModel.findByIdAndUpdate(
            jobId,
            updateJobDto,
            { new: true }
        );
        return updatedJob;
    }

    async deleteJob(employerId: string, jobId: string) {
        const job = await this.jobModel.findById(jobId);
        if (!job) {
            throw new NotFoundException('Job not found');
        }

        if (job.employerId.toString() !== employerId) {
            throw new ForbiddenException('You can only delete your own jobs');
        }

        await this.jobModel.findByIdAndDelete(jobId);
        return { message: 'Job deleted successfully' };
    }
}
