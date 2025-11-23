import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsDateString,
    MaxLength,
    IsArray,
    Matches, isArray, IsInt, Min,
} from 'class-validator';
import { DocumentaryStatus } from '../documentary.entity';

export class CreateDocumentaryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsString()
    thumbnailPreview: string;

    @IsOptional()
    @IsString()
    videoUrl?: string;

    @IsOptional()
    @IsString()
    videoFile?: string;

    @IsString()
    @Matches(/^\d{1,2}:\d{2}$/)
    duration: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsDateString()
    publishDate: string;

    @IsEnum(DocumentaryStatus)
    status: DocumentaryStatus;

    @IsOptional()
    @IsString()
    @MaxLength(60)
    seoTitle?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    seoDescription?: string;

    @IsOptional()
    @IsString()
    seoKeywords?: string;

    @IsString()
    //@Matches(/^[a-z0-9-]+$/)
    slug: string;

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    views: number = 1;
}
