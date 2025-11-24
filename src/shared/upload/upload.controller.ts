import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException, Delete, Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { UploadService } from './upload.service';
import { UploadType } from './file-type.enum';
import * as fs from "fs";
// 🔧 تابع تنظیمات ذخیره‌سازی برای پوشه‌های مختلف
export const uploadOptions = (folder: string) => ({
    storage: diskStorage({
        destination: `./uploads/${folder}`,
        filename: (_req, file, cb) => {
            const unique = uuid();
            let ext = extname(file.originalname);

            if (!ext) {
                const mimeExt = file.mimetype?.split('/')[1] || 'bin';
                ext = '.' + mimeExt;
            }

            const filename = `${unique}${ext}`;
            cb(null, filename);
        },
    }),
});

@Controller('v1/uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {
        ['uploads', 'uploads/images', 'uploads/videos', 'uploads/files'].forEach(p => {
            if (!fs.existsSync(p)) fs.mkdirSync(p);
        });
    }

    // 🖼️ تصاویر
    @Post('image')
    @UseInterceptors(
        FileInterceptor('file', {
            ...uploadOptions('images'),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.startsWith('image/')) {
                    return cb(
                        new BadRequestException('فقط فایل تصویری مجاز است!'),
                        false,
                    );
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 }, // حداکثر ۵ مگابایت
        }) as any,
    )
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const upload = await this.uploadService.saveFile(file, UploadType.IMAGE);
        return { url: upload.url, id: upload.id };
    }

    // 🎥 ویدیو
    @Post('video')
    @UseInterceptors(
        FileInterceptor('file', {
            ...uploadOptions('videos'),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.startsWith('video/')) {
                    return cb(
                        new BadRequestException('فقط فایل ویدیویی مجاز است!'),
                        false,
                    );
                }
                cb(null, true);
            },
            limits: { fileSize: 100 * 1024 * 1024 }, // تا 100MB
        }) as any,
    )
    async uploadVideo(@UploadedFile() file: Express.Multer.File) {
        const upload = await this.uploadService.saveFile(file, UploadType.VIDEO);
        return { url: upload.url, id: upload.id };
    }

    // 📄 فایل عمومی (pdf, docx, zip و ...)
    @Post('file')
    @UseInterceptors(
        FileInterceptor('file', {
            ...uploadOptions('files'),
            fileFilter: (req, file, cb) => {
                // هر نوع فایلی مجاز است ولی می‌تونیم محدود کنیم:
                const allowed = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/zip',
                    'application/x-zip-compressed',
                    'text/plain',
                ];
                if (!allowed.includes(file.mimetype)) {
                    return cb(
                        new BadRequestException('نوع فایل مجاز نیست!'),
                        false,
                    );
                }
                cb(null, true);
            },
            limits: { fileSize: 20 * 1024 * 1024 }, // تا ۲۰ مگابایت
        }) as any,
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const upload = await this.uploadService.saveFile(file, UploadType.FILE);
        return { url: upload.url, id: upload.id };
    }

    @Delete()
    async deleteFile(@Body('url') url: string) {
        try {
            // مسیر فایل را از URL استخراج کن
            const relativePath = url.replace(/^.*\/uploads\//, '');
            const filePath = `./uploads/${relativePath}`;

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                //await this.uploadService.removeFile(url); // اگر در DB ذخیره می‌کنی
                return { success: true, message: 'فایل حذف شد' };
            }
            return { success: false, message: 'فایل یافت نشد' };
        } catch (err) {
            return { success: false, message: 'خطا در حذف فایل', error: err.message };
        }
    }
}