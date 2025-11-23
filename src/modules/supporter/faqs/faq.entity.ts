import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn, JoinColumn, ManyToOne,
} from 'typeorm';
import {Category} from "../../../shared/category/category.entity";

export enum FaqStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('faqs')
export class Faq {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    order: number;

    @Column({ type: 'text' })
    question: string;

    @Column({ type: 'text' })
    answer: string;

    @ManyToOne(() => Category, { eager: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: string;

    /*@Column({ type: 'enum', enum: FaqStatus, default: FaqStatus.ACTIVE })
    status: FaqStatus;*/

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}