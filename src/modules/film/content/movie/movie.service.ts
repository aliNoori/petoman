import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {CreateMovieDto} from "./dto/movie-create.dto";
import {Movie} from "./movie.entity";
import {Category} from "../../../../shared/category/category.entity";
import {UpdateMovieDto} from "./dto/movie-update.dto";
import {deleteFile} from "../../../../utils/file-upload.utils";
import {NotificationType} from "../../../../shared/notification/notification.entity";
import {NotificationService} from "../../../../shared/notification/notification.service";


@Injectable()
export class MovieService {
    constructor(
        private notifService: NotificationService,
        @InjectRepository(Movie)
        private readonly movieRepo: Repository<Movie>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) {}

    async create(dto: CreateMovieDto,user): Promise<Movie> {
        const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
        if (!category) throw new NotFoundException('Category not found');

        const movie = this.movieRepo.create({
            ...dto,
            category,
        });

        await this.notifService.create({
            userId: user.id,
            type: NotificationType.IN_APP,
            title: 'فیلم جدید',
            message: 'فیلم جدید با موفقیت ثبت شد.',
            icon:'ti ti-check text-green-600',
            color:'bg-green-100',
            panelType:'film'
        });

        return this.movieRepo.save(movie);
    }


    async findAll(): Promise<Movie[]> {
        return this.movieRepo.find({ relations: ['category'] });
    }

    async findOne(id: string): Promise<Movie> {
        const movie = await this.movieRepo.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!movie) throw new NotFoundException('Movie not found');
        return movie;
    }

    async update(id: string, dto: UpdateMovieDto): Promise<Movie> {
        const movie = await this.findOne(id);
        const category = await this.categoryRepo.findOne({
            where: { id: dto.categoryId },
        });
        if (!category) throw new NotFoundException('Category not found');

        Object.assign(movie, dto, { category });
        return this.movieRepo.save(movie);
    }

    async remove(id: string): Promise<void> {
        const movie = await this.findOne(id);

        if (movie.poster) {
            await deleteFile(movie.poster, 'images');
        }
        if (movie.videoLink) {
            await deleteFile(movie.videoLink, 'videos');
        }
        await this.movieRepo.remove(movie);
    }
}
