import {Controller, Get, Post, Put, Delete, Param, Body, Patch, UseGuards} from '@nestjs/common';
import { MovieService } from './movie.service';
import {CreateMovieDto} from "./dto/movie-create.dto";
import {Movie} from "./movie.entity";
import {UpdateMovieDto} from "./dto/movie-update.dto";
import {CurrentUser} from "../../../../shared/auth/guards/current-user.decorator";
import {User} from "../../../../shared/user/entities/user.entity";
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../../../shared/auth/guards/jwt-auth.guard";
import {ResourceGuard} from "../../../../shared/auth/guards/resource.guard";
import {ACL} from "../../../../shared/auth/guards/acl.decorator";


@ApiTags('movies')
@UseGuards(JwtAuthGuard/*,ResourceGuard*/)
//@ACL('create', 'supporters')
@Controller({path:'movies',version:"1"})

export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Post()
    async create(@Body() dto: CreateMovieDto,@CurrentUser() user: User): Promise<Movie> {
        return this.movieService.create(dto,user);
    }

    @Get()
    async findAll(): Promise<Movie[]> {
        return this.movieService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Movie> {
        return this.movieService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateMovieDto,
    ): Promise<Movie> {
        return this.movieService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.movieService.remove(id);
    }
}
