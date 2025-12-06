import { PartialType } from '@nestjs/mapped-types';
import {CreatePostDto} from "./create-post.dto";
import {IsBoolean, IsOptional} from "class-validator";
import {Transform} from "class-transformer";

export class UpdatePostDto extends PartialType(CreatePostDto) {

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    commentsEnabled?: boolean;
}
