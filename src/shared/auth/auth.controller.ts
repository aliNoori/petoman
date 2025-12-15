import {
    BadRequestException,
    Body,
    Controller, Get,
    Logger,
    Patch,
    Post,
    UploadedFile, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {uploadOptions} from "../../utils/file-upload.utils";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {CurrentUser} from "./guards/current-user.decorator";
import {User} from "../user/entities/user.entity";
import {VerifyOtpDto} from "./dto/verify-otp.dto";
import {RefreshTokenDto} from "./dto/refresh-token.dto";
import {UpdateProfileDto} from "../user/dto/update-profile.dto";
import {UpdateUserDto} from "../user/dto/update-user.dto";

/*@Controller('auth')*/
@Controller({path:'auth',version:'1'})
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    @UseInterceptors(FileInterceptor('avatar', uploadOptions('users')) as any)
    register(@Body() dto: RegisterDto,
             @UploadedFile() file?: Express.Multer.File) {

        /*if (!file) {
            throw new BadRequestException('فایل تصویر ارسال نشده است');
        }*/

        const imageUrl = file ? `/uploads/users/${file.filename}` : 'null';
        return this.authService.register({...dto, avatar: imageUrl});
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    // بررسی شماره تلفن
    @Post('check-phone')
    checkPhone(@Body('phoneNumber') phoneNumber: string) {
        if (!phoneNumber) throw new BadRequestException('شماره تلفن الزامی است');
        return this.authService.checkPhoneNumber(phoneNumber);
    }

    // ارسال OTP
    @Post('send-otp')
    sendOtp(@Body('phoneNumber') phoneNumber: string) {
        if (!phoneNumber) throw new BadRequestException('شماره تلفن الزامی است');
        return this.authService.sendOtp(phoneNumber);
    }

    // تایید OTP
    @Post('verify-otp')
    verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto);
    }

    // رفرش توکن
    @Post('refresh')
    refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshToken(dto);
    }

    // خروج
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    logout(@CurrentUser() user: User) {
        return this.authService.logout(user.id);
    }

    // دریافت اطلاعات کاربر فعلی
    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: User) {
        return this.authService.getCurrentUser(user.id);
    }

    // بروزرسانی پروفایل
    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('avatar', uploadOptions('users')) as any)
    updateProfile(
        @CurrentUser() user: User,
        @Body() dto: UpdateUserDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const imageUrl = file ? `/uploads/users/${file.filename}` : undefined;
        return this.authService.updateProfile(user.id, { ...dto, avatar: imageUrl });
    }

}
