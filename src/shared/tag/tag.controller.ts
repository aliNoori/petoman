// file: tag.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';


@Controller('tags')
export class TagController {
    constructor(private readonly tagService: TagService) {}


    @Get()
    findAll() {
        return this.tagService.findAll();
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tagService.findOne(id);
    }


    @Post()
    create(@Body() dto: CreateTagDto) {
        return this.tagService.create(dto);
    }


    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
        return this.tagService.update(id, dto);
    }
    @Patch(':id/increment')
    incrementCount(@Param('id') id: string) {
        return this.tagService.incrementCount(id);
    }
    @Patch(':id/decrement')
    decrementCount(@Param('id') id: string) {
        return this.tagService.decrementCount(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tagService.remove(id);
    }
}