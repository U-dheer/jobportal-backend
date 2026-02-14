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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { Application } from './application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('applications')
@ApiTags('Applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('JobSeeker')
  @Post(':jobId')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'jobId',
    type: 'string',
    description: 'Job ID to apply for',
  })
  @ApiOperation({
    summary: 'Apply for Job',
    description: 'Submit a job application (JobSeeker only)',
  })
  @ApiBody({
    type: CreateApplicationDto,
    examples: {
      simpleApplication: {
        summary: 'Basic Application',
        value: {
          coverLetter: 'I am very interested in this position.',
        },
      },
      fullApplication: {
        summary: 'Full Application with Resume',
        value: {
          resumeUrl: 'https://cloudinary.com/...',
          coverLetter:
            'Dear Hiring Manager, I am very interested in the Senior Software Engineer position. With 7 years of experience in React and Node.js, I am confident...',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Application submitted successfully',
    type: Application,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only JobSeekers can apply',
  })
  async apply(
    @Request() req,
    @Param('jobId') jobId: string,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.applicationsService.apply(
      req.user.sub,
      jobId,
      createApplicationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get My Applications',
    description:
      'Retrieve all applications submitted by the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Applications retrieved successfully',
    type: [Application],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async myApplications(@Request() req) {
    return this.applicationsService.findByJobSeeker(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('JobSeeker')
  @Get('my-jobs')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get My Applied Jobs',
    description: 'Get all jobs the authenticated JobSeeker has applied to',
  })
  @ApiResponse({
    status: 200,
    description: 'Jobs retrieved successfully',
    type: [Application],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only JobSeekers can access',
  })
  async myAppliedJobs(@Request() req) {
    return this.applicationsService.findJobsByJobSeeker(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('job/:jobId')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'jobId',
    type: 'string',
    description: 'Job ID',
  })
  @ApiOperation({
    summary: 'Get Job Applications',
    description: 'Get all applications for a specific job',
  })
  @ApiResponse({
    status: 200,
    description: 'Applications retrieved successfully',
    type: [Application],
  })
  async applicationsForJob(@Param('jobId') jobId: string) {
    return this.applicationsService.findByJob(jobId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  @Delete(':applicationId')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'applicationId',
    type: 'string',
    description: 'Application ID to delete',
  })
  @ApiOperation({
    summary: 'Delete Application',
    description: 'Delete an application (Employer only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Application deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
  })
  async deleteApplication(@Param('applicationId') applicationId: string) {
    return this.applicationsService.deleteApplication(applicationId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  @Patch(':applicationId/status')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'applicationId',
    type: 'string',
    description: 'Application ID',
  })
  @ApiOperation({
    summary: 'Update Application Status',
    description: 'Update the status of an application (Employer only)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['Applied', 'Viewed', 'Rejected'],
        },
      },
      required: ['status'],
    },
    examples: {
      viewed: {
        summary: 'Mark as Viewed',
        value: { status: 'Viewed' },
      },
      rejected: {
        summary: 'Reject Application',
        value: { status: 'Rejected' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Application status updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
  })
  async updateApplicationStatus(
    @Param('applicationId') applicationId: string,
    @Body() body: { status: string },
  ) {
    return this.applicationsService.updateApplicationStatus(
      applicationId,
      body.status,
    );
  }
}
