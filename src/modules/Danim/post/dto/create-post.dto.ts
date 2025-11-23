import {
    IsString,
    IsOptional,
    IsEnum,
    IsBoolean,
    MaxLength,
    IsNotEmpty,
    IsArray,
    IsDateString,
} from 'class-validator';
import { PostStatus } from "../post.entity";
import { Transform } from "class-transformer";

export class CreatePostDto {
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

    @IsOptional()
    @IsString()
    @MaxLength(70)
    metaTitle?: string;

    @IsOptional()
    @IsString()
    @MaxLength(170)
    metaDescription?: string;

    @IsEnum(PostStatus)
    status: PostStatus;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    showInMenu?: boolean;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsArray()
    categories?: string[];

    @IsOptional()
    @IsArray()
    tags?: string[];

    @IsOptional()
    @IsArray()
    keywords?: string[];   // 👈 اضافه شد

    @IsOptional()
    @IsString()
    ogTitle?: string;

    @IsOptional()
    @IsString()
    ogDescription?: string;

    @IsOptional()
    @IsString()
    ogImage?: string;

    @IsOptional()
    @IsString()
    schemaType?: string;

    @IsOptional()
    @IsDateString()
    publishDate?: string;
}