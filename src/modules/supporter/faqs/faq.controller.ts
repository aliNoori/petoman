import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseUUIDPipe,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Controller({ path: 'faqs', version: '1' })
export class FaqController {
    constructor(private readonly faqService: FaqService) {}

    @Post()
    create(@Body() dto: CreateFaqDto) {
        return this.faqService.create(dto);
    }

    @Get()
    findAll() {
        return this.faqService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.faqService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFaqDto) {
        return this.faqService.update(id, dto);
    }

    @Patch(':id/status')
    toggleStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: { isActive: boolean }
    ) {
        return this.faqService.toggleStatus(id, body.isActive)
    }


    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.faqService.remove(id);
    }
}