import { DataSource } from 'typeorm';
import { Category} from "../shared/category/category.entity";
import { CategoryTypeEntity} from "../shared/category/category-type.entity";
import {Post} from '../modules/Danim/post/post.entity'
import {Tag} from "../shared/tag/tag.entity";
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'ame@6558U',
    database: 'pet',
    entities: [Category,Post, CategoryTypeEntity,Tag],
    synchronize: false,
});
