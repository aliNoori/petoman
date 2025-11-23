import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
    Min,
    IsDateString,
} from 'class-validator';
import { DonationStatus, DonationMethod } from '../donation.entity';

export class CreateDonationDto {
    @IsString()
    @IsNotEmpty()
    supporterId: string;

    @IsString()
    @IsNotEmpty()
    projectId: string;

    @IsNumber()
    @Min(1000)
    amount: number;

    @IsEnum(DonationMethod)
    method: DonationMethod;

    @IsOptional()
    @IsString()
    trackingCode?: string;

    @IsOptional()
    @IsString()
    transactionTime?: string;

    @IsOptional()
    @IsString()
    checkNumber?: string;

    @IsDateString()
    date: string;

    @IsString()
    time: string;

    @IsEnum(DonationStatus)
    status: DonationStatus;

    @IsOptional()
    @IsString()
    note?: string;
}