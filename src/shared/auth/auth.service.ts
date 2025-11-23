import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {plainToInstance} from "class-transformer";
import {LoginResponseDto} from "./dto/login.response.dto";
import {RegisterResponseDto} from "./dto/register.response.dto";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const user = await this.userService.create(dto);

        return plainToInstance(RegisterResponseDto, {
            accessToken: this.jwtService.sign({ userId: user.id }),
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                phoneNumber: user.phoneNumber,
                isVerified: user.isVerified,
            },
        });

    }

    async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(dto.password, user.password);

        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        return plainToInstance(LoginResponseDto, {
            accessToken: this.jwtService.sign({ userId: user.id }),
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                roles:user.roles,
                phoneNumber: user.phoneNumber,
                isVerified: user.isVerified,
            },
        });
    }
}
