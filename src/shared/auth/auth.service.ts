import {Inject, Injectable, Logger, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {plainToInstance} from "class-transformer";
import {LoginResponseDto} from "./dto/login.response.dto";
import {RegisterResponseDto} from "./dto/register.response.dto";
import {User, UserRole} from "../user/entities/user.entity";
import {VerifyOtpDto} from "./dto/verify-otp.dto";
import {RefreshTokenDto} from "./dto/refresh-token.dto";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import {Cache} from 'cache-manager';
import {OtpService} from "../gateways/sms/otp.service";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly otpService:OtpService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {
    }

    async register(dto: RegisterDto) {
        const user = await this.userService.create({...dto,roles:[UserRole.SUBSCRIBER]});

        return plainToInstance(RegisterResponseDto, {
            accessToken: this.jwtService.sign({userId: user.id}),
            token:this.jwtService.sign({userId: user.id}),
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
            accessToken: this.jwtService.sign({userId: user.id}),
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                roles: user.roles,
                phoneNumber: user.phoneNumber,
                isVerified: user.isVerified,
            },
        });
    }


    // بررسی شماره تلفن
    async checkPhoneNumber(phoneNumber: string): Promise<{ exists: boolean }> {
        const user = await this.userService.findByPhoneNumber(phoneNumber);
        return {exists: !!user};
    }

    // ارسال OTP (اینجا فقط شبیه‌سازی شده)
    async sendOtp(phoneNumber: string): Promise<{success:boolean, message: string/*, code: string*/ }> {
        const user = await this.userService.findByPhoneNumber(phoneNumber);
        //if (!user) throw new NotFoundException('کاربر یافت نشد');
        // اینجا باید سرویس ارسال پیامک OTP اضافه بشه
        // const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        // await (this.cacheManager as any).set(`otp:${phoneNumber}`, otpCode, {ttl: 300});
        // return {message: 'کد تایید ارسال شد', code: otpCode};
        return await this.otpService.generateAndSend(phoneNumber);

    }

    // تایید OTP
    async verifyOtp(dto: VerifyOtpDto) {
        // اینجا باید بررسی کد OTP انجام بشه
        // const user = await this.userService.findByPhoneNumber(dto.phoneNumber);
        // if (!user) {
        //     const cachedCode = await this.cacheManager.get<string>(`otp:${dto.phoneNumber}`);
        //     if (!cachedCode) throw new Error('کد منقضی شده یا یافت نشد');
        //     if (cachedCode !== dto.code) throw new Error('کد وارد شده صحیح نیست');
        //
        //     return {
        //         token: null,
        //         user:null,
        //     };
        //
        // }
        //
        // const cachedCode = await this.cacheManager.get<string>(`otp:${dto.phoneNumber}`);
        // if (!cachedCode) throw new Error('کد منقضی شده یا یافت نشد');
        // if (cachedCode !== dto.code) throw new Error('کد وارد شده صحیح نیست');

        return await this.otpService.verify(dto.code,dto.phoneNumber);
    }

    // رفرش توکن
    async refreshToken(dto: RefreshTokenDto) {
        try {
            const payload = this.jwtService.verify(dto.refreshToken);
            const user = await this.userService.findById(payload.userId);
            if (!user) throw new UnauthorizedException();

            return {
                token: this.jwtService.sign({userId: user.id}),
                user,
            };
        } catch {
            throw new UnauthorizedException('Refresh token invalid');
        }
    }

    // خروج
    async logout(userId: string) {
        // اگر توکن‌ها رو در دیتابیس نگه می‌داری، اینجا باید invalidate بشن
        this.logger.log(`User ${userId} logged out`);
        return {message: 'خروج موفقیت‌آمیز بود'};
    }

    // دریافت اطلاعات کاربر فعلی
    async getCurrentUser(userId: string): Promise<User> {
        const user = await this.userService.findById(userId);
        if (!user) throw new NotFoundException('کاربر یافت نشد');
        return user;
    }

    // بروزرسانی پروفایل
    async updateProfile(userId: string, dto: UpdateUserDto): Promise<User> {
        return await this.userService.update(userId, dto);
    }
}
