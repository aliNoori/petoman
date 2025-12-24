import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './upload.entity';
import { UploadType } from './file-type.enum';
import * as fs from "fs";
@Injectable()
export class UploadService {
  constructor(
      @InjectRepository(Upload)
      private readonly uploadRepo: Repository<Upload>,
  ) {}

  async saveFile(file: Express.Multer.File, type: UploadType): Promise<Upload> {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const filename = file.filename;
    const folder =
        type === UploadType.IMAGE
            ? 'images'
            : type === UploadType.VIDEO
                ? 'videos'
                : 'files';

    const url = `${baseUrl}/uploads/${folder}/${filename}`;

    const upload = this.uploadRepo.create({
      filename,
      mimetype: file.mimetype,
      url,
    });

    return this.uploadRepo.save(upload);
  }

  async deleteFile(url: string) {
    try {
      if (!url) return { success: false, message: 'URL نامعتبر' }

      const relativePath = url.replace(/^.*\/uploads\//, '')
      const filePath = `./uploads/${relativePath}`

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        return { success: true, message: 'فایل حذف شد' }
      }

      return { success: false, message: 'فایل یافت نشد' }
    } catch (err) {
      throw new InternalServerErrorException('خطا در حذف فایل')
    }
  }
}