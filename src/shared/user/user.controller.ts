// src/users/users.controller.ts

import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {SetOnlineDto} from "./dto/set-online.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CurrentUser} from "../auth/guards/current-user.decorator";
import {User} from "./entities/user.entity";
import {UpdateUserSettingDto} from "./dto/update-user-setting.dto";
import {ChangePasswordDto} from "./dto/password.dto";

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @ApiBody({ type: CreateUserDto })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get('me')
    async getMe(@CurrentUser() user: User) {

        return this.userService.findOne(user.id);
    }
    @ApiResponse({ status: 200, description: 'لیست کاربران', type: [CreateUserDto] })
    @Get()
    findAll(@CurrentUser() user: User) {
        return this.userService.findFiltered(user);
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

    @Get('me/settings')
    async getMySettings(@CurrentUser() user: User) {
        return this.userService.getUserSettings(user.id)
    }

    @Patch('me/settings')
    async updateMySettings(
        @CurrentUser() user: User,
        @Body() dto: UpdateUserSettingDto,
    ) {
        return this.userService.updateUserSettings(user.id, dto)
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    changePassword(
        @Req() req,
        @Body() dto: ChangePasswordDto,
    ) {
        return this.userService.changePassword(req.user.id, dto)
    }



}