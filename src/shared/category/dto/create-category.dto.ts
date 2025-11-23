// src/modules/category/dto/create-category.dto.ts
import { IsOptional, IsString, IsUUID, IsBoolean, IsInt } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsUUID()
    parentId?: string | null;

    @IsOptional()
    @IsUUID()
    typeId?: string | null;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsInt()
    sortOrder?: number;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @IsString()
    cover?: string;
}