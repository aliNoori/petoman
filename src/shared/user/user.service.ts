import {ForbiddenException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {User, UserRole} from "./entities/user.entity";
import {In, Raw, Repository} from "typeorm";
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
        let hashedPassword='12345678';
        if(createUserDto.password)
        hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = await this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.userRepository.save(user);
    }
    /*findAll(): Promise<User[]> {
        return this.userRepository.find();
    }*/

    async findFiltered(currentUser: any) {
        const accessMap = {
            admin: null,
            danim_admin: ['danim_subscriber','danim_admin','danim_author','danim_editor'],
            supporter_admin: ['hamian_subscriber','supporter_admin','supporter_subscriber'],
            film_admin: ['film_subscriber','film_admin'],
            vet_admin: ['vet_subscriber','vet_admin'],
            market_admin: ['market_subscriber','market_admin']
        };

        const userRoles: string[] = currentUser.roles;

        if (userRoles.includes('admin')) {
            return this.userRepository.find({ order: { createdAt: 'DESC' } });
        }

        const managerRole = userRoles.find(r => accessMap[r]);
        if (!managerRole) throw new ForbiddenException('شما دسترسی مشاهده کاربران را ندارید');

        const allowedRoles = accessMap[managerRole];

        return this.userRepository.find({
            where: {
                roles: Raw(alias => `${alias} ?| array[:...roles]`, { roles: allowedRoles })
            },
            order: { createdAt: 'DESC' }
        });
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

    async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { phoneNumber } } as any);
    }
    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
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
