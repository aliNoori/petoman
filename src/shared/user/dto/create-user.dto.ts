import {
    IsArray,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
    IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../entities/user.entity';
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'علی نوری', description: 'نام کاربر' })
    @IsString()
    fullName: string;

    @IsOptional()
    @IsString()
    username: string;
    @ApiProperty({ example: 'matineali@gmail.com', description: 'ایمیل کاربر' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', description: 'رمز عبور' })
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dateOfBirth?: Date;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(UserRole, { each: true })
    roles?: UserRole[];

    @IsOptional()
    @IsEnum([true, false])
    isActive?: boolean;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    lastLogin?: Date;
}