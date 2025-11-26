import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {User, UserRole} from "./entities/user.entity";
import {Repository} from "typeorm";
import {UpdateUserDto} from "./dto/update-user.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {InjectRepository} from '@nestjs/typeorm';
import {Supporter} from "../../modules/supporter/public-supporters/supporter.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Supporter)
        private readonly supporterRepo: Repository<Supporter>,
    ) {}
    async create(createUserDto: CreateUserDto): Promise<User> {
        //this.logger.log(`${createUserDto.avatar}`);
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = await this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            //roles: [UserRole.SUPPORTER_ADMIN,UserRole.DANIM_ADMIN],
        });
        return this.userRepository.save(user);
    }
    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
    async getSupportersWithDonations() {
        const supporters = await this.supporterRepo.find({
            relations: ['user', 'donations', 'donations.kindnessMeeting'],
        })

        return supporters.map(supporter => ({
            supporterId: supporter.id,
            user: {
                id: supporter.user.id,
                fullName: supporter.user.fullName,
                email: supporter.user.email,
                phoneNumber: supporter.user.phoneNumber,
            },
            totalDonations: supporter.donations.length,
            donations: supporter.donations.map(donation => ({
                id: donation.id,
                amount: donation.amount,
                method: donation.method,
                status: donation.status,
                date: donation.date,
                time: donation.time,
                note:donation.note,
                kindnessMeeting: {
                    id: donation.kindnessMeeting?.id,
                    title: donation.kindnessMeeting?.title,
                },
            })),
        }))
    }
    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: id });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
    async setOnlineStatus(userId: string, online: boolean) {
        await this.userRepository.update(userId, {
            isOnline: online,
            lastSeen: !online ? new Date() : null,
        });
    }
    async getOnlineUsers(): Promise<User[]> {
        return this.userRepository.find({ where: { isOnline: true } });
    }

    async toggleUserStatus(id: string) {
        const user = await this.findOne(id);
        user.isActive = !user.isActive;
        return this.userRepository.save(user);
    }


}
