import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseUUIDPipe, UseInterceptors, UploadedFiles, UploadedFile,
} from '@nestjs/common';
import {KindnessService} from './kindness.service';
import {CreateKindnessMeetingDto} from './dto/create-kindness-meeting.dto';
import {UpdateKindnessMeetingDto} from './dto/update-kindness-meeting.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {uploadOptions} from "../../../utils/file-upload.utils";
import {KindnessStatus} from "./kindness-meeting.entity";
import {ACL} from "../../../shared/auth/guards/acl.decorator";

@Controller({path: 'kindness-meetings', version: '1'})
@ACL('create', 'supporters')
export class KindnessController {
    constructor(private readonly kindnessService: KindnessService) {
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', uploadOptions('kindness-meetings')) as any)
    create(@UploadedFile() file: Express.Multer.File,
           @Body() dto: CreateKindnessMeetingDto)
    {
        return this.kindnessService.create(dto, file);
    }

    @Get()
    findAll() {
        return this.kindnessService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.kindnessService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image', uploadOptions('kindness-meetings')) as any)
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UpdateKindnessMeetingDto
    ) {
        return this.kindnessService.update(id, dto, file)
    }
    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('status') status: KindnessStatus
    ) {
        return this.kindnessService.toggleStatus(id, status)
    }


    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.kindnessService.remove(id);
    }
}