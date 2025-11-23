import { PartialType } from '@nestjs/mapped-types';
import { CreatePageDto } from './create-page.dto';
import {
    IsOptional,
    IsBoolean,
    IsDate,
    IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePageDto extends PartialType(CreatePageDto) {

    @IsOptional()
    @Transform(({ value }) => (value ? new Date(value) : null))
    @IsDate()
    publishDate?: Date;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    showInMenu?: boolean;

    @IsOptional()
    @IsString()
    ogImage?: string;

    @IsOptional()
    @IsString()
    image?: string;
}
