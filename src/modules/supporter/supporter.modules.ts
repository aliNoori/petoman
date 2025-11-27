import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Donation} from "./donation/donation.entity";
import {KindnessMeeting} from "./kindness-meeting/kindness-meeting.entity";
import {Supporter} from "./public-supporters/supporter.entity";
import {DonationController} from "./donation/donation.controller";
import {KindnessController} from "./kindness-meeting/kindness.controller";
import {SupporterController} from "./public-supporters/supporter.controller";
import {DonationService} from "./donation/donation.service";
import {KindnessService} from "./kindness-meeting/kindness.service";
import {SupporterService} from "./public-supporters/supporter.service";
import {Documentary} from "./documentation/documentary.entity";
import {Faq} from "./faqs/faq.entity";
import {Page} from "./page-builder/page.entity";
import {DocumentaryController} from "./documentation/documentary.controller";
import {FaqController} from "./faqs/faq.controller";
import {PageController} from "./page-builder/page.controller";
import {DocumentaryService} from "./documentation/documentary.service";
import {FaqService} from "./faqs/faq.service";
import {PageService} from "./page-builder/page.service";
import {SettingModule} from "./setting/setting.modules";
import {User} from "../../shared/user/entities/user.entity";
import {NotificationModule} from "../../shared/notification/notification.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Documentary,
            Donation,
            Faq,
            KindnessMeeting,
            Page,
            Supporter,
            User
        ]),
        SettingModule,
        NotificationModule
        //FileModule, // اگر فایل یا تصویر داشته باشن
        //UserModule, // اگر به کاربر وصل باشن
    ],
    controllers: [
        DocumentaryController,
        DonationController,
        FaqController,
        KindnessController,
        PageController,
        SupporterController,
    ],
    providers: [
        DocumentaryService,
        DonationService,
        FaqService,
        KindnessService,
        PageService,
        SupporterService,
    ],
})
export class SupporterModule {}
