// src/auth/dto/register.dto.ts

import {IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength} from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {UserRole} from "../../user/entities/user.entity";

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com', description: 'ایمیل کاربر' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'علی رضایی', description: 'نام کامل کاربر' })
    @IsNotEmpty()
    fullName: string;

    @ApiPropertyOptional({ example: 'ali_reza', description: 'نام کاربری' })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ example: 'mypassword123', description: 'رمز عبور (حداقل ۸ کاراکتر)' })
    @MinLength(8)
    password: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.png', description: 'آواتار کاربر' })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiPropertyOptional({ example: [UserRole.DANIM_ADMIN], description: 'نقش‌های کاربر', enum: UserRole, isArray: true })
    @IsOptional()
    @IsArray()
    @IsEnum(UserRole, { each: true })
    roles?: UserRole[];
}