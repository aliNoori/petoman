// src/utils/file-upload.utils.ts
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname, join } from 'path';

export const uploadOptions = (folder: string) => ({
    storage: diskStorage({
        destination: (_req, _file, cb) => {
            // مسیر مطلق روی سرور
            const uploadPath = join('/var/www/petoman/uploads', folder);
            cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
            const unique = uuid();
            const ext = extname(file.originalname);
            cb(null, `${unique}${ext}`);
        },
    }),
});

/*
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

export const uploadOptions = (folder: string) => ({
    storage: diskStorage({
        destination: `./uploads/${folder}`,
        filename: (_req, file, cb) => {
            const unique = uuid();
            const ext = extname(file.originalname);
            cb(null, `${unique}${ext}`);
        },
    }),
});*/
