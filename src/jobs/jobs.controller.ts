import { Body, Controller, Get, Param, Post, Query, UseGuards, Request, Patch, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Request() req, @Body() createJobDto: CreateJobDto) {
        return this.jobsService.create(req.user.sub, createJobDto);
    }

    @Get()
    async findAll(@Query() query: any) {
        return this.jobsService.findAll(query);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Employer')
    @Get('my')
    async findMyJobs(@Request() req) {
        return this.jobsService.findByEmployer(req.user.sub);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.jobsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Employer')
    @Patch(':jobId')
    async updateJob(
        @Request() req,
        @Param('jobId') jobId: string,
        @Body() updateJobDto: UpdateJobDto
    ) {
        return this.jobsService.updateJob(req.user.sub, jobId, updateJobDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Employer')
    @Delete(':jobId')
    async deleteJob(@Request() req, @Param('jobId') jobId: string) {
        return this.jobsService.deleteJob(req.user.sub, jobId);
    }
}
