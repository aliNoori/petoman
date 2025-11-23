// file: tag.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;


    @Column({ unique: true })
    slug: string;


    @Column({ nullable: true })
    description: string;


    @Column({ default: 0 })
    count: number;


    @Column({ default: 'هرگز' })
    lastUsed: string;
}