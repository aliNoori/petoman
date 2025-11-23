import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    senderId: string;

    @Column()
    receiverId: string;

    @Column('text')
    text: string;

    @CreateDateColumn()
    sentAt: Date;

    @Column({ default: false })
    isDelivered: boolean;

    @Column({ type: 'timestamp', nullable: true })
    seenAt: Date | null;

}