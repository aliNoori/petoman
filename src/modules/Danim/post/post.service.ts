import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {Post} from "./post.entity";
import {Category} from "../../../shared/category/category.entity";
import {CreatePostDto} from "./dto/create-post.dto";
import {UpdatePostDto} from "./dto/update-post.dto";
import {NotificationType} from "../../../shared/notification/notification.entity";
import {NotificationService} from "../../../shared/notification/notification.service";
import {PostLike} from "./post-like.entity";
import {User} from "../../../shared/user/entities/user.entity";
import {PostBookmark} from "./post-bookmark.entity";

@Injectable()
export class PostService {
    constructor(
        private notifService: NotificationService,
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,
        @InjectRepository(PostLike)
        private readonly postLikeRepo: Repository<PostLike>,
        @InjectRepository(PostBookmark)
        private readonly postBookmarkRepo: Repository<PostBookmark>,
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
            categories,
            author: onlineUser,
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

    async findAll(userId?: string) {
        const posts = await this.postRepo.find({ relations: ['author', 'categories'] });
        if (userId) {

            const likes = await this.postLikeRepo.find({
                where: { user: { id: userId } },
                relations: ['post'],
            }as any);
            const likedPostIds = likes.map(like => like.post.id);

            // بررسی وضعیت بوک‌مارک (اگر داری)
            const bookmarks = await this.postBookmarkRepo.find({
                where: { user: { id: userId } },
                relations: ['post'],
            } as any);
            const bookmarkedPostIds = bookmarks.map(b => b.post.id);

            return posts.map(post => ({
                ...post,
                liked: likedPostIds.includes(post.id),
                bookmarked: bookmarkedPostIds.includes(post.id),
            }));
        }

        return posts.map(post => ({
            ...post,
            liked: false,
            bookmarked: false,
        }));
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

    async toggleLike(postId: string, userId: string) {
        const post = await this.postRepo.findOne({ where: { id: postId } });
        if (!post) throw new NotFoundException('Post not found');

        const existing = await this.postLikeRepo.findOne({
            where: { post: { id: postId }, user: { id: userId } },
            relations: ['post', 'user'],
        } as any);

        if (existing) {

            await this.postLikeRepo.remove(existing);
            post.likes = Math.max((post.likes ?? 0) - 1, 0);
            await this.postRepo.save(post);
            return { liked: false, likes: post.likes };
        } else {

            const like = this.postLikeRepo.create({ post, user: { id: userId } as User });
            await this.postLikeRepo.save(like);
            post.likes = (post.likes ?? 0) + 1;
            await this.postRepo.save(post);
            return { liked: true, likes: post.likes };
        }
    }

    async toggleBookmark(postId: string, userId: string) {
        const post = await this.postRepo.findOne({ where: { id: postId } });
        if (!post) throw new NotFoundException('Post not found');

        const existing = await this.postBookmarkRepo.findOne({
            where: { post: { id: postId }, user: { id: userId } },
            relations: ['post', 'user'],
        } as any);

        if (existing) {
            // اگر قبلاً بوکمارک شده بود → حذف کن
            await this.postBookmarkRepo.remove(existing);
            return { bookmarked: false };
        } else {
            // اگر نبود → اضافه کن
            const bookmark = this.postBookmarkRepo.create({
                post,
                user: { id: userId } as User,
            });
            await this.postBookmarkRepo.save(bookmark);
            return { bookmarked: true };
        }
    }


}
