// payments/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm'
import { Transaction} from "../transaction/transaction.entity";

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    amount: number

    @Column({ default: OrderStatus.PENDING })
    status: OrderStatus

    @OneToMany(() => Transaction, t => t.order)
    transactions: Transaction[]

    @CreateDateColumn()
    createdAt: Date
}
