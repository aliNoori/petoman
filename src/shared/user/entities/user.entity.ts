import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne, OneToMany,
} from 'typeorm';
import { Supporter} from "../../../modules/supporter/public-supporters/supporter.entity";
import {IsOptional, IsString} from "class-validator";
import {Notification} from "../../notification/notification.entity";

export enum UserRole {
    //USER = 'user',
    SUBSCRIBER='subscriber',
    ADMIN = 'admin',
    SUPPORTER_ADMIN = 'supporter_admin',
    HAMIAN_SUBSCRIBER='hamian_subscriber',
    SUPPORTER_SUBSCRIBER = 'supporter_subscriber',
    DANIM_ADMIN = 'danim_admin',
    DANIM_SUBSCRIBER='danim_subscriber',
    FILM_ADMIN = 'film_admin',
    FILM_SUBSCRIBER='film_subscriber',
    MARKET_ADMIN = 'market_admin',
    MARKET_SUBSCRIBER='market_subscriber',
    VET_ADMIN = 'vet_admin',
    VET_SUBSCRIBER='vet_subscriber',
    DANIM_EDITOR='danim_editor',
    DANIM_AUTHOR='danim_author',


}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    fullName: string;

    @IsOptional()
    @Column({ nullable: true ,unique: true})
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true, unique: true })
    phoneNumber: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    avatar?: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'date', nullable: true })
    dateOfBirth?: Date;

    @Column({ default: false })
    isOnline: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastSeen?: Date|null;

    @Column({ type: 'jsonb', nullable: true, default: [] })
    roles: UserRole[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastLogin?: Date | null;


    // ✅ ارتباط با Supporter
    @OneToOne(() => Supporter, (supporter) => supporter.user)
    supporterProfile: Supporter;

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];
}