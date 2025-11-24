// file: tag.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';


@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
    ) {}


    findAll() {
        return this.tagRepository.find();
    }


    findOne(id: string) {
        return this.tagRepository.findOne({ where: { id } });
    }


    async create(dto: CreateTagDto) {
        const tag = this.tagRepository.create(dto);
        return this.tagRepository.save(tag);
    }


    async update(id: string, dto: UpdateTagDto) {
        const tag = await this.tagRepository.findOne({ where: { id } });
        if (!tag) throw new NotFoundException('Tag not found');


        Object.assign(tag, dto);
        return this.tagRepository.save(tag);
    }

    async incrementCount(id: string) {
        const tag = await this.tagRepository.findOne({ where: { id } });
        if (!tag) throw new NotFoundException('Tag not found');

        tag.count = (tag.count || 0) + 1;
        tag.lastUsed = new Date().toISOString();

        return await this.tagRepository.save(tag);
    }

    async decrementCount(id: string) {
        const tag = await this.tagRepository.findOne({ where: { id } });
        if (!tag) throw new NotFoundException('Tag not found');

        if (tag.count > 0) {
            tag.count = tag.count - 1;
            tag.lastUsed = new Date().toISOString();
            return await this.tagRepository.save(tag);
        }

        return tag; // اگر صفر بود، همون رو برگردون
    }



    async remove(id: string) {
        const tag = await this.tagRepository.findOne({ where: { id } });
        if (!tag) throw new NotFoundException('Tag not found');
        return this.tagRepository.remove(tag);
    }
}