import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity('user_settings')
export class UserSetting {
    @PrimaryGeneratedColumn('uuid')
    id: string

    /* -------- Notifications -------- */
    @Column({ default: true })
    newFilmsNotification: boolean

    @Column({ default: false })
    commentsNotification: boolean

    /* -------- Privacy -------- */
    @Column({ default: true })
    publicProfile: boolean

    @Column({ default: true })
    showFavorites: boolean

    /* -------- Relations -------- */
    @OneToOne(() => User, user => user.settings, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User

    @Column()
    userId: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
