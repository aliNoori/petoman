import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseUUIDPipe, UseGuards, Req,
} from '@nestjs/common';

import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import {JwtAuthGuard} from "../../../shared/auth/guards/jwt-auth.guard";
import {ResourceGuard} from "../../../shared/auth/guards/resource.guard";
import {ACL} from "../../../shared/auth/guards/acl.decorator";
import {CurrentUser} from "../../../shared/auth/guards/current-user.decorator";
import {User} from "../../../shared/user/entities/user.entity";

@Controller({ path: 'posts', version: '1' })
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    @UseGuards(JwtAuthGuard, ResourceGuard)
    @ACL('create', 'posts')
    async create(@Body() dto: CreatePostDto,@CurrentUser() user: User) {
        return this.postService.create(dto,user);
    }

    @Get()
    async findAll(@Req() req) {
        const user = req.user as User | undefined;
        const userId = user?.id;
        return this.postService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.postService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, ResourceGuard)
    @ACL('create', 'posts')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdatePostDto,
    ) {
        return this.postService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, ResourceGuard)
    @ACL('create', 'posts')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.postService.remove(id);
    }

    // 👇 افزایش ویو
    @Patch(':id/views')
    incrementViews(@Param('id', ParseUUIDPipe) id: string) {
        return this.postService.incrementViews(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/like')
    async toggleLike(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: User,
    ) {
        const userId = user.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        return this.postService.toggleLike(id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/bookmark')
    async toggleBookmark(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: User,
    ) {
        const userId = user.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        return this.postService.toggleBookmark(id, userId);
    }
}