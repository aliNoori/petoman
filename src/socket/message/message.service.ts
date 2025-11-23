import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Message} from "./message.entity";
import {In, Repository} from "typeorm";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly repo: Repository<Message>
    ) {}

    async save(payload: {
        senderId: string;
        receiverId: string;
        text: string;
        isDelivered?: boolean;
    }) {
        const msg = this.repo.create({
            ...payload,
            isDelivered: payload.isDelivered ?? false,
        });
        return await this.repo.save(msg);
    }
    async getPendingMessages(userId: string): Promise<Message[]> {
        return await this.repo.find({
            where: {
                receiverId: userId,
                isDelivered: false,
            },
            order: { sentAt: 'ASC' }, // برای ترتیب زمانی
        });
    }
    async markAsDelivered(messageId: string): Promise<void> {
        await this.repo.update(messageId, {
            isDelivered: true,
        });
    }

    async markAsSeen(messageId: string): Promise<void> {
        await this.repo.update(messageId, {
            seenAt: new Date(),
        });
    }
    async findById(messageId: string): Promise<Message|null> {
        return await this.repo.findOne({ where: { id: messageId } });
    }

    async getSeenStatuses(messageIds: string[]): Promise<
        { messageId: string; status: 'sent' | 'delivered' | 'seen'; seenAt?: Date }[]
    > {
        const messages = await this.repo.findBy({ id: In(messageIds) });

        return messages.map(msg => {
            const status = msg.seenAt
                ? 'seen'
                : msg.isDelivered
                    ? 'delivered'
                    : 'sent';

            return {
                messageId: msg.id,
                status,
                seenAt: msg.seenAt || undefined,
            };
        });
    }

}