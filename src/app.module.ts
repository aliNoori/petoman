import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {UserModule} from "./shared/user/user.module";
import {AuthModule} from "./shared/auth/auth.module";
import {User} from "./shared/user/entities/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {ChatGateway} from './socket/chat.gateway';
import {Message} from "./socket/message/message.entity";
import {MessageModule} from './socket/message/message.module';
import {JwtModule} from "@nestjs/jwt";
import {SupporterModule} from "./modules/supporter/supporter.modules";
import {Faq} from "./shared/faq/faq.entity";
import {Documentary} from "./modules/supporter/documentation/documentary.entity";
import {Donation} from "./modules/supporter/donation/donation.entity";
import {KindnessMeeting} from "./modules/supporter/kindness-meeting/kindness-meeting.entity";
import {Page} from "./modules/supporter/page-builder/page.entity";
import {Supporter} from "./modules/supporter/public-supporters/supporter.entity";
import {AppearanceSetting} from "./modules/supporter/setting/appearance/appearance-setting.entity";
import {GeneralSetting} from "./modules/supporter/setting/general/general-setting.entity";
import {OpenGraphSetting} from "./modules/supporter/setting/open-graph/open-graph-setting.entity";
import {PaymentSetting} from "./modules/supporter/setting/payment/payment-setting.entity";
import {SchemaSetting} from "./modules/supporter/setting/schema/schema-setting.entity";
import {SeoSetting} from "./modules/supporter/setting/seo/seo-setting.entity";
import {CategoryModule} from "./shared/category/category.module";
import {Category} from "./shared/category/category.entity";
import {CategoryTypeEntity} from "./shared/category/category-type.entity";
import {UploadModule} from "./shared/upload/upload.module";
import {Upload} from "./shared/upload/upload.entity";
import {Post} from "./modules/Danim/post/post.entity";
import {DanimModule} from "./modules/Danim/danim.modules";
import {TagModule} from "./shared/tag/tag.module";
import {Tag} from "./shared/tag/tag.entity";
import {DanimPage} from "./modules/Danim/page/page.entity";
import {DanimGeneralSetting} from "./modules/Danim/setting/general/general-setting.entity";
import {DanimSeoSetting} from "./modules/Danim/setting/seo/seo-setting.entity";
import {DanimOpenGraphSetting} from "./modules/Danim/setting/open-graph/open-graph-setting.entity";
import {DanimSchemaSetting} from "./modules/Danim/setting/schema/schema-setting.entity";
import {AccessControlModule} from "nest-access-control";
import {roles} from "./shared/auth/guards/roles";
import {DanimHomePageSetting} from "./modules/Danim/setting/home-page/home-page.enitity";
import {DanimPerformanceSetting} from "./modules/Danim/setting/performance/performance-setting.entity";
import {AppController} from "./app.controller";
import {Notification} from "./shared/notification/notification.entity";
import {NotificationModule} from "./shared/notification/notification.module";
import {FilmModule} from "./modules/film/film.module";
import {Movie} from "./modules/film/content/movie/movie.entity";
import {TagType} from "./shared/tag/tag-type.entity";
import {Series} from "./modules/film/content/series/entities/series.entity";
import {Season} from "./modules/film/content/series/entities/season.entity";
import {Episode} from "./modules/film/content/series/entities/episode.entity";
import {FaqType} from "./shared/faq/faq-type.entity";
import {FaqModule} from "./shared/faq/faq.module";
import {FilmPage} from "./modules/film/page/page.entity";
import {FilmPost} from "./modules/film/post/post.entity";
import {Comment} from "./modules/film/comment/comment.entity";
import {FilmGeneralSetting} from "./modules/film/setting/general/entities/general-setting.entity";
import {FilmAdvanceSetting} from "./modules/film/setting/general/entities/advance-setting.entity";
import {FilmSeoSetting} from "./modules/film/setting/general/entities/seo-setting.entity";
import {FilmApiSetting} from "./modules/film/setting/general/entities/api-setting.entity";
import {FilmSocialSetting} from "./modules/film/setting/general/entities/social-setting.entity";
import {FilmOpengraphSetting} from "./modules/film/setting/general/entities/opengraph-setting.entity";

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true, // برای دسترسی در کل پروژه
    }), TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'ame@6558U',
        database: 'pet',
        entities: [
            User,Upload,Category,CategoryTypeEntity, Message,Notification, Documentary, Donation, Faq,FaqType, KindnessMeeting,
            Page, Supporter, AppearanceSetting, GeneralSetting, OpenGraphSetting,
            PaymentSetting, SchemaSetting, SeoSetting,Post,Tag,TagType,DanimPage,DanimGeneralSetting,
            DanimSeoSetting,DanimOpenGraphSetting,DanimSchemaSetting,DanimHomePageSetting,
            DanimPerformanceSetting,Movie,Series,Season,Episode,FilmPage,FilmPost,Comment,
            FilmGeneralSetting, FilmAdvanceSetting,
            FilmSeoSetting,
            FilmApiSetting,
            FilmSocialSetting,
            FilmOpengraphSetting
        ], // یا از autoLoadEntities استفاده کن
        synchronize: true, // فقط برای توسعه، نه تولید!
    }), JwtModule.register({
        secret: process.env.JWT_SECRET || 'secret-key',
        signOptions: {expiresIn: '1d'},
    }), AccessControlModule.forRoles(roles),UserModule,UploadModule,CategoryModule,TagModule,FaqModule,NotificationModule, ConfigModule, AuthModule, MessageModule, SupporterModule,DanimModule,FilmModule],
    controllers: [AppController],
    providers: [AppService, ChatGateway],
})
export class AppModule {
}
