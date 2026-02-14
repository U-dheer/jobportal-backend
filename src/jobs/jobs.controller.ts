import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { Job } from './job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('jobs')
@ApiTags('Jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create Job Posting',
    description: 'Create a new job posting (Employer only)',
  })
  @ApiBody({
    type: CreateJobDto,
    examples: {
      softwareEngineer: {
        summary: 'Software Engineer Position',
        value: {
          title: 'Senior Software Engineer',
          description:
            'We are seeking an experienced Software Engineer with 5+ years of experience in React and Node.js to join our team.',
          salary: 150000,
          location: 'San Francisco, CA',
        },
      },
      productManager: {
        summary: 'Product Manager Position',
        value: {
          title: 'Product Manager',
          description:
            'Looking for a strategic Product Manager to lead our mobile app initiative and drive product roadmap.',
          salary: 140000,
          location: 'New York, NY',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Job created successfully',
    type: Job,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only Employers can create jobs',
  })
  async create(@Request() req, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(req.user.sub, createJobDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List All Jobs',
    description:
      'Get a list of all jobs with optional filtering by title and location',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: 'string',
    description: 'Filter by job title',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    type: 'string',
    description: 'Filter by job location',
  })
  @ApiResponse({
    status: 200,
    description: 'Jobs retrieved successfully',
    type: [Job],
  })
  async findAll(@Query() query: any) {
    return this.jobsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  @Get('my')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get My Jobs',
    description: 'Get all jobs posted by the authenticated employer',
  })
  @ApiResponse({
    status: 200,
    description: 'Jobs retrieved successfully',
    type: [Job],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only Employers can access',
  })
  async findMyJobs(@Request() req) {
    return this.jobsService.findByEmployer(req.user.sub);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Job ID',
  })
  @ApiOperation({
    summary: 'Get Job Details',
    description: 'Retrieve details of a specific job',
  })
  @ApiResponse({
    status: 200,
    description: 'Job retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
  })
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  @Patch(':jobId')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'jobId',
    type: 'string',
    description: 'Job ID to update',
  })
  @ApiOperation({
    summary: 'Update Job Posting',
    description: 'Update a job posting (Employer only)',
  })
  @ApiBody({
    type: UpdateJobDto,
    examples: {
      partialUpdate: {
        summary: 'Update Salary Only',
        value: {
          salary: 160000,
        },
      },
      fullUpdate: {
        summary: 'Update All Fields',
        value: {
          title: 'Lead Software Engineer',
          description: 'Updated description with new requirements',
          salary: 170000,
          location: 'San Francisco, CA',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Job updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only job owner can update',
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
  })
  async updateJob(
    @Request() req,
    @Param('jobId') jobId: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.updateJob(req.user.sub, jobId, updateJobDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  @Delete(':jobId')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'jobId',
    type: 'string',
    description: 'Job ID to delete',
  })
  @ApiOperation({
    summary: 'Delete Job Posting',
    description: 'Delete a job posting (Employer only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Job deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only job owner can delete',
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
  })
  async deleteJob(@Request() req, @Param('jobId') jobId: string) {
    return this.jobsService.deleteJob(req.user.sub, jobId);
  }
}
