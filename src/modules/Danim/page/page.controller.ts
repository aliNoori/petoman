import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseUUIDPipe,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadOptions } from '../../../utils/file-upload.utils';

@Controller({ path: 'danim-pages', version: '1' })
export class PageController {
    constructor(private readonly pageService: PageService) {}

    // --- ایجاد صفحه جدید ---
    @Post()
    @UseInterceptors(FileInterceptor('image', uploadOptions('pages')) as any)
    async create(
        @Body() dto: CreatePageDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.pageService.create(dto, file);
    }

    // --- لیست صفحات ---
    @Get()
    async findAll() {
        return this.pageService.findAll();
    }

    // --- دریافت یک صفحه ---
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.pageService.findOne(id);
    }

    // --- بروزرسانی صفحه ---
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image', uploadOptions('pages')) as any)
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdatePageDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.pageService.update(id, dto, file);
    }

    // --- حذف صفحه ---
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.pageService.remove(id);
    }
}