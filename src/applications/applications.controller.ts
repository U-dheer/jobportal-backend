import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Delete,
    Patch,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('applications')
export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('JobSeeker')
    @Post(':jobId')
    async apply(
        @Request() req,
        @Param('jobId') jobId: string,
        @Body() createApplicationDto: CreateApplicationDto,
    ) {
        return this.applicationsService.apply(req.user.sub, jobId, createApplicationDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async myApplications(@Request() req) {
        return this.applicationsService.findByJobSeeker(req.user.sub);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('JobSeeker')
    @Get('my-jobs')
    async myAppliedJobs(@Request() req) {
        return this.applicationsService.findJobsByJobSeeker(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('job/:jobId')
    async applicationsForJob(@Param('jobId') jobId: string) {
        return this.applicationsService.findByJob(jobId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Employer')
    @Delete(':applicationId')
    async deleteApplication(@Param('applicationId') applicationId: string) {
        return this.applicationsService.deleteApplication(applicationId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Employer')
    @Patch(':applicationId/status')
    async updateApplicationStatus(
        @Param('applicationId') applicationId: string,
        @Body() body: { status: string }
    ) {
        return this.applicationsService.updateApplicationStatus(applicationId, body.status);
    }
}
