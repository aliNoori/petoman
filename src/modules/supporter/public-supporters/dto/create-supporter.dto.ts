import {
    IsString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsEmail,
    IsPhoneNumber,
    IsDateString,
    IsNumber,
    Min,
    MaxLength,
} from 'class-validator';
import { SupporterType, SupporterStatus } from '../supporter.entity';

export class CreateSupporterDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsPhoneNumber('IR')
    @IsNotEmpty()
    phone: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsEnum(SupporterType)
    type: SupporterType;

    @IsDateString()
    joinDate: string;

    @IsEnum(SupporterStatus)
    status: SupporterStatus;

    @IsOptional()
    @IsNumber()
    @Min(0)
    initialAmount?: number;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    userId?: string;
}