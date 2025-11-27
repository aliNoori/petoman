import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostController} from "./post.controller";
import {PostService} from "./post.service";
import {Post} from "./post.entity"
import {Category} from "../../../shared/category/category.entity";
import {NotificationModule} from "../../../shared/notification/notification.module";

@Module({
    imports: [TypeOrmModule.forFeature([Post,Category]),NotificationModule],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
