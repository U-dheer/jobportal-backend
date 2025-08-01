import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Patch('suspend/:userId')
    @Roles('Admin')
    async suspendUser(@Param('userId') userId: string) {
        return this.adminService.suspendUser(userId);
    }

    @Patch('activate/:userId')
    @Roles('Admin')
    async activateUser(@Param('userId') userId: string) {
        return this.adminService.activateUser(userId);
    }

    @Delete('delete/:userId')
    async deleteUser(@Param('userId') userId: string) {
        return this.adminService.deleteUser(userId);
    }

    @Get('report')
    async usageReport() {
        return this.adminService.usageReport();
    }
}
