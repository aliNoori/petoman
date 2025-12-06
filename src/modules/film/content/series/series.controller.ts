import {Controller, Get, Post, Body, Param, Patch, Delete, UseGuards} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dtos/create-series.dto';
import { UpdateSeriesDto } from './dtos/update-series.dto';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../../../shared/auth/guards/jwt-auth.guard";
import {CurrentUser} from "../../../../shared/auth/guards/current-user.decorator";
import {User} from "../../../../shared/user/entities/user.entity";


@ApiTags('series')
@UseGuards(JwtAuthGuard/*,ResourceGuard*/)
//@ACL('create', 'supporters')
@Controller({path:'series',version:'1'})
export class SeriesController {
    constructor(private readonly service: SeriesService) {}

    @Post()
    create(@Body() dto: CreateSeriesDto,@CurrentUser() user: User) {
        return this.service.create(dto,user);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateSeriesDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }

    @Delete(':seriesId/seasons/:seasonId')
    removeSeason(
        @Param('seriesId') seriesId: string,
        @Param('seasonId') seasonId: string,
    ) {
        return this.service.removeSeason(seriesId, seasonId);
    }

    @Delete(':seriesId/seasons/:seasonId/episodes/:episodeId')
    removeEpisode(
        @Param('seriesId') seriesId: string,
        @Param('seasonId') seasonId: string,
        @Param('episodeId') episodeId: string,
    ) {
        return this.service.removeEpisode(seriesId, seasonId, episodeId);
    }
}
