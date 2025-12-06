// src/auth/dto/login.dto.ts

import { IsEmail, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'ایمیل کاربر' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'mypassword123', description: 'رمز عبور کاربر' })
    @IsString()
    password: string;
}