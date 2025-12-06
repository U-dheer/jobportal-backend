import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('health')
    async healthCheck() {
        console.log('Admin health check endpoint called');
        return { status: 'Admin module is working', timestamp: new Date().toISOString() };
    }

    @Get('users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
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
    async suspendUser(@Param('userId') userId: string) {
        return this.adminService.suspendUser(userId);
    }

    @Patch('activate/:userId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    async activateUser(@Param('userId') userId: string) {
        return this.adminService.activateUser(userId);
    }

    @Delete('delete/:userId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    async deleteUser(@Param('userId') userId: string) {
        return this.adminService.deleteUser(userId);
    }

    @Get('report')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
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
