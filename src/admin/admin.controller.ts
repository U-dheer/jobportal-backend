import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User } from '../users/user.schema';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('health')
  @ApiOperation({
    summary: 'Health Check',
    description: 'Check if the admin module is operational',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin module is working',
    schema: {
      example: {
        status: 'Admin module is working',
        timestamp: '2024-02-14T12:00:00.000Z',
      },
    },
  })
  async healthCheck() {
    console.log('Admin health check endpoint called');
    return {
      status: 'Admin module is working',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get All Users',
    description: 'Retrieve a list of all users in the system (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [User],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getAllUsers() {
    console.log('Admin getAllUsers endpoint called');
    try {
      const users = await this.adminService.getAllUsers();
      console.log('Returning users:', users.length);
      return users;
    } catch (error) {
      console.error('Error in getAllUsers controller:', error);
      throw error;
    }
  }

  @Patch('suspend/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User ID to suspend',
  })
  @ApiOperation({
    summary: 'Suspend User',
    description: 'Suspend a user account (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'User suspended successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async suspendUser(@Param('userId') userId: string) {
    return this.adminService.suspendUser(userId);
  }

  @Patch('activate/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User ID to activate',
  })
  @ApiOperation({
    summary: 'Activate User',
    description: 'Activate a suspended user account (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'User activated successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async activateUser(@Param('userId') userId: string) {
    return this.adminService.activateUser(userId);
  }

  @Delete('delete/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'User ID to delete',
  })
  @ApiOperation({
    summary: 'Delete User',
    description: 'Permanently delete a user account (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Get('report')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get Usage Report',
    description: 'Get system usage statistics and analytics (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Report retrieved successfully',
    schema: {
      example: {
        totalUsers: 150,
        totalJobs: 45,
        totalApplications: 320,
        totalMessages: 1200,
        activeUsers: 140,
        suspendedUsers: 10,
        jobSeekers: 100,
        employers: 45,
        systemStats: {
          uptime: '5h 30m',
          memoryUsage: '45%',
          cpuUsage: '25%',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async usageReport() {
    console.log('Admin usageReport endpoint called');
    try {
      const report = await this.adminService.usageReport();
      console.log('Returning report:', report);
      return report;
    } catch (error) {
      console.error('Error in usageReport controller:', error);
      throw error;
    }
  }
}
