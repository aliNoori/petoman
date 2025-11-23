import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DanimPage} from "./page.entity";
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import slugify from 'slugify';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(DanimPage)
        private readonly pageRepo: Repository<DanimPage>,
    ) {}

    // -------------------
    // CREATE
    // -------------------
    async create(dto: CreatePageDto, file?: Express.Multer.File) {
        // اگر slug نبود خودش بسازد
        if (!dto.slug) {
            dto.slug = slugify(dto.title, { lower: true, strict: true });
        }

        const page = this.pageRepo.create(dto);

        if (file) {
            page.image = `/uploads/pages/${file.filename}`;
        }

        return this.pageRepo.save(page);
    }

    // -------------------
    // FIND ALL
    // -------------------
    async findAll() {
        return this.pageRepo.find({
            order: { createdAt: 'DESC' },
        });
    }

    // -------------------
    // FIND ONE
    // -------------------
    async findOne(id: string) {
        const page = await this.pageRepo.findOne({ where: { id } });
        if (!page) throw new NotFoundException('Page not found');
        return page;
    }

    // -------------------
    // UPDATE
    // -------------------
    async update(id: string, dto: UpdatePageDto, file?: Express.Multer.File) {
        const page = await this.findOne(id);

        // اگر slug جدید نیامد و title تغییر کرد، slug جدید ساخته نشود
        if (dto.title && !dto.slug) {
            dto.slug = slugify(dto.title, { lower: true, strict: true });
        }

        // convert publishDate اگر string باشد
        if (dto.publishDate) {
            dto.publishDate = new Date(dto.publishDate);
        }

        // preload بهترین روش برای merge + validate entity
        const updated = await this.pageRepo.preload({
            id,
            ...dto,
        });

        if (!updated) throw new NotFoundException('Page not found');

        // اگر فایل جدید آمد → فایل قبلی حذف شود
        if (file) {
            if (page.image) this.deleteOldFile(page.image);

            updated.image = `/uploads/pages/${file.filename}`;
        }

        return this.pageRepo.save(updated);
    }

    // -------------------
    // DELETE
    // -------------------
    async remove(id: string) {
        const page = await this.findOne(id);

        if (page.image) {
            this.deleteOldFile(page.image);
        }

        return this.pageRepo.remove(page);
    }

    // -------------------
    // PRIVATE: FILE DELETE
    // -------------------
    private deleteOldFile(imageUrl: string) {
        const fullPath = join(process.cwd(), 'public', imageUrl.replace('/uploads/', ''));

        if (existsSync(fullPath)) {
            unlinkSync(fullPath);
        }
    }
}