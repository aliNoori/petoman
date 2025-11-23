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


    async remove(id: string) {
        const tag = await this.tagRepository.findOne({ where: { id } });
        if (!tag) throw new NotFoundException('Tag not found');
        return this.tagRepository.remove(tag);
    }
}