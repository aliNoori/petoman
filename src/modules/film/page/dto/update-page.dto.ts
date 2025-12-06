import { PartialType } from '@nestjs/mapped-types';
import { CreatePageDto } from './create-page.dto';
import {IsBoolean, IsOptional} from "class-validator";
import {Transform} from "class-transformer";

export class UpdatePageDto extends PartialType(CreatePageDto) {

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    showInMenu?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    commentsEnabled?: boolean;
}
