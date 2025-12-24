// payments/entities/transaction.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, CreateDateColumn
} from 'typeorm'
import { Order} from "../order/order.entity";

export enum TransactionStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    gateway: string

    @Column()
    amount: number

    @Column({ nullable: true })
    authority?: string

    @Column({ nullable: true })
    refId?: string

    @Column({ default: TransactionStatus.PENDING })
    status: TransactionStatus

    // ✅ اطلاعات کمک‌کننده
    @Column({ type: 'jsonb', nullable: true })
    supporterInfo?: {
        donorName?: string
        donorPhone?: string
        isAnonymous?:boolean
        acceptTerms?:boolean
        purpose?:string
        email?: string
        message?: string
        meetingId?: string
        userId?: string
    }

    @ManyToOne(() => Order, o => o.transactions)
    order: Order

    @CreateDateColumn()
    createdAt: Date
}