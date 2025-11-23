import { IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class CreateTagDto {
    @IsString()
    @IsNotEmpty()
    name: string;


    @IsString()
    @IsNotEmpty()
    slug: string;


    @IsString()
    @IsOptional()
    description?: string;
}