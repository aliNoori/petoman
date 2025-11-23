import {BadRequestException, Body, Controller, Logger, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {uploadOptions} from "../../utils/file-upload.utils";

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

}
