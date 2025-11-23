import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import {Category} from "../../../shared/category/category.entity";

@Injectable()
export class FaqService {
    constructor(
        @InjectRepository(Faq)
        private readonly faqRepo: Repository<Faq>,
    ) {}

    async create(dto: CreateFaqDto) {
        // بررسی وجود Category
        const category = await this.faqRepo.manager.findOne(Category, { where: { id: dto.categoryId } });
        if (!category) throw new NotFoundException('دسته‌بندی پیدا نشد');

        const faq = this.faqRepo.create({
            order: dto.order,
            question: dto.question,
            answer: dto.answer,
            category,
            categoryId: category.id,
            isActive: dto.isActive ?? true,
        });

        return this.faqRepo.save(faq);
    }


    async findAll() {
        return this.faqRepo.find({ order: { order: 'ASC' } });
    }

    async findOne(id: string) {
        const faq = await this.faqRepo.findOneBy({ id });
        if (!faq) throw new NotFoundException('سوال پیدا نشد');
        return faq;
    }

    async update(id: string, dto: UpdateFaqDto) {
        const faq = await this.findOne(id);

        if (dto.categoryId) {
            const category = await this.faqRepo.manager.findOne(Category, { where: { id: dto.categoryId } });
            if (!category) throw new NotFoundException('دسته‌بندی پیدا نشد');
            faq.category = category;
            faq.categoryId = category.id;
        }

        Object.assign(faq, dto);
        return this.faqRepo.save(faq);
    }


    async toggleStatus(id: string, isActive: boolean) {
        const faq = await this.findOne(id)
        faq.isActive = isActive
        return this.faqRepo.save(faq)
    }


    async remove(id: string) {
        const faq = await this.findOne(id);
        return this.faqRepo.remove(faq);
    }
}