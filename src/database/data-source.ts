import { DataSource } from 'typeorm';
import { Category} from "../shared/category/category.entity";
import { CategoryTypeEntity} from "../shared/category/category-type.entity";
import {Post} from '../modules/Danim/post/post.entity'
import {Tag} from "../shared/tag/tag.entity";
import {Movie} from "../modules/film/content/movie/movie.entity";
import {TagType} from "../shared/tag/tag-type.entity";
import {FilmPost} from "../modules/film/post/post.entity";
import {Series} from "../modules/film/content/series/entities/series.entity";
import {Season} from "../modules/film/content/series/entities/season.entity";
import {Episode} from "../modules/film/content/series/entities/episode.entity";
import {Faq} from "../shared/faq/faq.entity";
import {FaqType} from "../shared/faq/faq-type.entity";
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'ame@6558U',
    database: 'pet',
    entities: [Category,Post,Faq,FaqType, CategoryTypeEntity,Tag,Movie,TagType,FilmPost,Series,Season,Episode],
    synchronize: false,
});
