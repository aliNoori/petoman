import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {Post} from "./post.entity";
import {Category} from "../../../shared/category/category.entity";
import {CreatePostDto} from "./dto/create-post.dto";
import {UpdatePostDto} from "./dto/update-post.dto";
import {NotificationType} from "../../../shared/notification/notification.entity";
import {NotificationService} from "../../../shared/notification/notification.service";

@Injectable()
export class PostService {
    constructor(
        private notifService: NotificationService,
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) {}

    async create(dto: CreatePostDto,onlineUser) {

        let categories: Category[] = [];
        if (dto.categories && dto.categories.length > 0) {
            categories = await this.categoryRepo.find({
                where: { id: In(dto.categories) },
            });
        }

        // مپ کردن دستی فیلدها
        const post = this.postRepo.create({
            title: dto.title,
            slug: dto.slug,
            content: dto.content,
            excerpt: dto.excerpt,
            metaTitle: dto.metaTitle,
            metaDescription: dto.metaDescription,
            status: dto.status,
            showInMenu: dto.showInMenu,
            image: dto.image,
            tags: dto.tags,
            keywords: dto.keywords,
            ogTitle: dto.ogTitle,
            ogDescription: dto.ogDescription,
            ogImage: dto.ogImage,
            schemaType: dto.schemaType,
            publishDate: dto.publishDate,
            categories, // 👈 دسته‌بندی‌ها با نام و id
        });

        await this.notifService.create({
            userId: onlineUser.id,
            type: NotificationType.POST,
            title: 'پست جدید',
            message: 'پست جدید با موفقیت ثبت شد.',
            icon:'ti ti-check text-green-600',
            color:'bg-green-100',
            panelType:'danim'
        });

        return this.postRepo.save(post);
    }

    async findAll() {
        return this.postRepo.find({
            order: { createdAt: 'DESC' },
            relations: ['categories'],
        });
    }

    async findOne(id: string) {
        const post = await this.postRepo.findOne({
            where: { id },
            relations: ['categories'],
        });
        if (!post) throw new NotFoundException('پست پیدا نشد');
        return post;
    }

    async update(id: string, dto: UpdatePostDto) {
        const post = await this.findOne(id);

        if (dto.categories && dto.categories.length > 0) {
            post.categories = await this.categoryRepo.find({
                where: {id: In(dto.categories)},
            });
        }

        // سایر فیلدها
        Object.assign(post, {
            title: dto.title ?? post.title,
            slug: dto.slug ?? post.slug,
            content: dto.content ?? post.content,
            excerpt: dto.excerpt ?? post.excerpt,
            metaTitle: dto.metaTitle ?? post.metaTitle,
            metaDescription: dto.metaDescription ?? post.metaDescription,
            status: dto.status ?? post.status,
            showInMenu: dto.showInMenu ?? post.showInMenu,
            image: dto.image ?? post.image,
            tags: dto.tags ?? post.tags,
            keywords: dto.keywords ?? post.keywords,
            ogTitle: dto.ogTitle ?? post.ogTitle,
            ogDescription: dto.ogDescription ?? post.ogDescription,
            ogImage: dto.ogImage ?? post.ogImage,
            schemaType: dto.schemaType ?? post.schemaType,
            publishDate: dto.publishDate ? new Date(dto.publishDate) : post.publishDate,
        });

        return this.postRepo.save(post);
    }

    async remove(id: string) {
        const post = await this.findOne(id);
        return this.postRepo.remove(post);
    }

    async incrementViews(id: string) {
        const post = await this.findOne(id);
        post.views = (post.views ?? 0) + 1;
        return this.postRepo.save(post);
    }

    async incrementLikes(id: string) {
        const post = await this.findOne(id);
        post.likes = (post.likes ?? 0) + 1;
        return this.postRepo.save(post);
    }

    async decrementLikes(id: string) {
        const post = await this.findOne(id);
        post.likes = Math.max((post.likes ?? 0) - 1, 0);
        return this.postRepo.save(post);
    }
}
