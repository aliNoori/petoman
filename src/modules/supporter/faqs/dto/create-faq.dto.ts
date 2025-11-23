import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsBoolean,
    IsInt,
    Min,
    MaxLength,
} from 'class-validator';
import { FaqStatus } from '../faq.entity';

export class CreateFaqDto {
    @IsInt()
    @Min(1)
    order: number;

    @IsString()
    @IsNotEmpty()
    question: string;

    @IsString()
    @IsNotEmpty()
    answer: string;

    @IsString()
    @IsNotEmpty()
    categoryId: string;
/*
    @IsEnum(FaqStatus)
    status: FaqStatus;*/

    @IsBoolean()
    isActive: boolean;
}