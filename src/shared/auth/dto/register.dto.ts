// src/auth/dto/register.dto.ts

import {IsEmail, IsNotEmpty, IsOptional, IsString, MinLength} from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    fullName: string;

    @IsOptional()
    @IsString()
    username: string;

    @MinLength(8)
    password: string;

    @IsOptional()
    @IsString()
    avatar?: string;
}