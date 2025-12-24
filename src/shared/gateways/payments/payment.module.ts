import { Module } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { ZarinpalGateway } from './gateways/zarinpal.gateway'
import {MulterModule} from "@nestjs/platform-express";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Upload} from "../../upload/upload.entity";
import {Order} from "../../order/order.entity";
import {Transaction} from "../../transaction/transaction.entity";
import {Supporter} from "../../../modules/supporter/public-supporters/supporter.entity";
import {KindnessMeeting} from "../../../modules/supporter/kindness-meeting/kindness-meeting.entity";
import {User} from "../../user/entities/user.entity";
import {Donation} from "../../../modules/supporter/donation/donation.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Order,Transaction,Supporter,KindnessMeeting,User,Donation]), // ← این خط مهمه
    ],
    controllers: [PaymentController],
    providers: [PaymentService, ZarinpalGateway],
    exports: [PaymentService],
})
export class PaymentModule {}