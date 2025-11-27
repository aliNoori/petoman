import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseUUIDPipe, UseGuards,
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
@UseGuards(JwtAuthGuard/*,ResourceGuard*/)
//@ACL('create', 'posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    async create(@Body() dto: CreatePostDto,@CurrentUser() user: User) {
        return this.postService.create(dto,user);
    }

    @Get()
    findAll() {
        return this.postService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.postService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdatePostDto,
    ) {
        return this.postService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.postService.remove(id);
    }

    // 👇 افزایش ویو
    @Patch(':id/views')
    incrementViews(@Param('id', ParseUUIDPipe) id: string) {
        return this.postService.incrementViews(id);
    }

    // 👇 افزایش لایک
    @Patch(':id/likes')
    incrementLikes(@Param('id', ParseUUIDPipe) id: string) {
        return this.postService.incrementLikes(id);
    }

    // 👇 کاهش لایک
    @Patch(':id/unlike')
    decrementLikes(@Param('id', ParseUUIDPipe) id: string) {
        return this.postService.decrementLikes(id);
    }
}