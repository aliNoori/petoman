// src/users/users.controller.ts

import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {SetOnlineDto} from "./dto/set-online.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @ApiBody({ type: CreateUserDto })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req: any) {

        return this.userService.findOne(req.user.id);
    }
    @ApiResponse({ status: 200, description: 'لیست کاربران', type: [CreateUserDto] })
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get('supporters-with-donations')
    getSupportersWithDonations() {
        return this.userService.getSupportersWithDonations()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
    @Get('online')
    async getOnlineUsers() {

        return await this.userService.getOnlineUsers();

    }
    @Post('set/online/status')
    async setOnlineStatus(@Body() dto: SetOnlineDto) {
        await this.userService.setOnlineStatus(dto.userId, dto.isOnline);
        return { success: true };
    }
    @Patch(':id/status')
    async toggleStatus(@Param('id') id: string) {
        return await this.userService.toggleUserStatus(id); // بازگشت کاربر با وضعیت جدید
    }

}