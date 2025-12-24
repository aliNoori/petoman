import {Injectable} from '@nestjs/common'
import {ZarinpalGateway} from './gateways/zarinpal.gateway'
import {PaymentGateway} from './gateways/payment-gateway.interface'
import {Order, OrderStatus} from "../../order/order.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Transaction, TransactionStatus} from "../../transaction/transaction.entity";
import {User, UserRole} from "../../user/entities/user.entity";
import {Supporter} from "../../../modules/supporter/public-supporters/supporter.entity";
import {Donation, DonationMethod, DonationStatus} from "../../../modules/supporter/donation/donation.entity";
import {SupporterType} from "../../../modules/supporter/requests/request-supporter.entity";
import {KindnessMeeting} from "../../../modules/supporter/kindness-meeting/kindness-meeting.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class PaymentService {
    private readonly gateways: Record<string, PaymentGateway>

    constructor(
        @InjectRepository(KindnessMeeting)
        private kindnessMeetingRepo: Repository<KindnessMeeting>,
        @InjectRepository(Donation)
        private donationRepo: Repository<Donation>,
        @InjectRepository(Supporter)
        private supporterRepo: Repository<Supporter>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        @InjectRepository(Transaction)
        private txRepo: Repository<Transaction>,
        private readonly zarinpal: ZarinpalGateway,
    ) {
        this.gateways = {
            zarinpal: this.zarinpal,
        }
    }

    async startPayment(gatewayName: string, amount: number, meta: any, supporterInfo: any) {
        const gateway = this.gateways[gatewayName]

        if (!gateway) throw new Error('Gateway not supported')

        // 1️⃣ Create Order
        const order = await this.orderRepo.save({amount})

        // 2️⃣ Create Transaction (pending)
        const transaction = await this.txRepo.save({
            gateway: gatewayName,
            amount,
            order,
            supporterInfo: {
                donorName: supporterInfo.donorName,
                donorPhone: supporterInfo.donorPhone,
                isAnonymous: supporterInfo.isAnonymous,
                purpose: supporterInfo.purpose,
                message: supporterInfo.message,
                acceptTerms: supporterInfo.acceptTerms,
                meetingId: supporterInfo.meetingId,
                userId: supporterInfo.userId
            },
        })
        // 3️⃣ Pay
        const result = await gateway.pay(
            amount,
            `${process.env.PAYMENT_CALLBACK_URL}?tx=${transaction.id}`,
            meta,
        )

        // 4️⃣ Save authority
        transaction.authority = result.authority
        await this.txRepo.save(transaction)

        return result.redirectUrl
    }

    async verifyPayment(gatewayName: string, data: any, txId: string) {
        const gateway = this.gateways[gatewayName]

        const tx = await this.txRepo.findOne({
            where: {id: txId},
            relations: ['order'],
        })

        if (!tx) {
            throw new Error('Transaction not found')
        }

        try {
            const result = await gateway.verify({
                ...data,
                Amount: tx.amount,
            })

            tx.status = TransactionStatus.SUCCESS
            tx.refId = result.RefID ?? result.refId
            tx.order.status = OrderStatus.PAID

            await this.txRepo.save(tx)
            await this.orderRepo.save(tx.order)
            //
            // ===============================
            // 🔥 1. پیدا یا ساخت User
            // ===============================
            const phone = tx.supporterInfo?.donorPhone;

            if (!phone) throw new Error('Phone not found in transaction meta');

            let user = await this.userRepo.findOne({
                where: {phoneNumber: phone},
            });

            if (!user) {
                let hashedPassword = '12345678';
                hashedPassword = await bcrypt.hash(hashedPassword, 10);
                user = await this.userRepo.save({
                    phoneNumber: phone,
                    fullName: tx.supporterInfo?.donorName,
                    isVerified: true,
                    password: hashedPassword,
                    roles: [UserRole.SUBSCRIBER],
                });
            }

            // ===============================
            // 🔥 2. پیدا یا ساخت Supporter
            // ===============================
            let supporter = await this.supporterRepo.findOne({
                where: {user: {id: user.id}},
                relations: ['user'],
            } as any);

            if (!supporter) {
                supporter = await this.supporterRepo.save({
                    user,
                    type: SupporterType.FINANCIAL,
                    joinDate: new Date().toISOString().slice(0, 10),
                    agreement: true,
                    showInList: true,
                });
            }

            let kindnessMeeting: KindnessMeeting | null = null
            if (tx.supporterInfo?.meetingId) {
                if (tx.supporterInfo) {
                    kindnessMeeting = await this.kindnessMeetingRepo.findOne({
                        where: {id: tx.supporterInfo.meetingId}
                    })
                }
            }

            if (!kindnessMeeting && supporter) {
                const donation = await this.donationRepo.save({
                    supporter,
                    amount: tx.amount,
                    method: DonationMethod.CARD,
                    status: DonationStatus.COMPLETED,
                    trackingCode: tx.refId,
                    note: tx.supporterInfo?.message,
                    date: new Date().toISOString().slice(0, 10),
                    time: new Date().toLocaleTimeString('fa-IR'),
                });

            } else if (kindnessMeeting && supporter) {
                // ===============================
                // 🔥 3. ثبت Donation
                // ===============================
                const donation = await this.donationRepo.save({
                    supporter,
                    kindnessMeeting,
                    amount: tx.amount,
                    method: DonationMethod.ONLINE,
                    status: DonationStatus.COMPLETED,
                    trackingCode: tx.refId,
                    note: tx.supporterInfo?.message,
                    date: new Date().toISOString().slice(0, 10),
                    time: new Date().toLocaleTimeString('fa-IR'),
                });
            }
            //

            return {
                success: true,
                orderId: tx.order.id,
                refId: tx.refId,
            }

        } catch (e) {
            tx.status = TransactionStatus.FAILED
            tx.order.status = OrderStatus.FAILED

            await this.txRepo.save(tx)
            await this.orderRepo.save(tx.order)

            return {
                success: false,
                orderId: tx.order.id,
                message: e.message,
            }
        }
    }

}