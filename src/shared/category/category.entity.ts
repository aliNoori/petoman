// src/modules/category/entities/category.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Tree,
    TreeChildren,
    TreeParent,
    Index,
    ManyToOne,
    JoinColumn, OneToMany, ManyToMany,
} from 'typeorm';
import { CategoryTypeEntity } from './category-type.entity';
import {Post} from '../../modules/Danim/post/post.entity'
@Entity('categories')
@Tree('closure-table')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 150 })
    title: string;

    @Index({ unique: true })
    @Column({ length: 160 })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ nullable: true })
    color?: string;

    @ManyToOne(() => CategoryTypeEntity, { nullable: true })
    type?: CategoryTypeEntity | null;

    @ManyToMany(() => Post, post => post.categories)
    posts: Post[];


    @TreeParent()
    parent?: Category | null;

    @Column({ nullable: true })
    typeId: string;

    @TreeChildren()
    children?: Category[];

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'int', default: 0 })
    sortOrder: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    logo?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    cover?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null;
}