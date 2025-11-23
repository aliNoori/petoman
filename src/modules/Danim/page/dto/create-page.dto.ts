import {
    IsString,
    IsOptional,
    IsEnum,
    IsBoolean,
    MaxLength,
    IsNotEmpty,
    IsDate,
} from 'class-validator';
import { PageStatus} from "../page.entity";
import { Transform } from 'class-transformer';

export class CreatePageDto {
    // --- Basic ---
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    slug?: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    excerpt?: string;

    // --- Status ---
    @IsEnum(PageStatus)
    status: PageStatus;

    // --- Template ---
    @IsOptional()
    @IsString()
    template?: string;

    // --- Publish Date ---
    @IsOptional()
    @Transform(({ value }) => (value ? new Date(value) : null))
    @IsDate()
    publishDate?: Date;

    // --- SEO ---
    @IsOptional()
    @IsString()
    @MaxLength(70)
    metaTitle?: string;

    @IsOptional()
    @IsString()
    @MaxLength(170)
    metaDescription?: string;

    // --- OpenGraph ---
    @IsOptional()
    @IsString()
    @MaxLength(100)
    ogTitle?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    ogDescription?: string;

    @IsOptional()
    @IsString()
    ogImage?: string;

    // --- Main Image ---
    @IsOptional()
    @IsString()
    image?: string;

    // --- Menu (if needed) ---
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    showInMenu?: boolean;
}