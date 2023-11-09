import { Injectable } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Injectable()
export class UploadMulter {
  static MulterOption(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
          const filename = file.originalname;
          return callback(null, filename);
        },
      }),

      limits: { fileSize: 1 * 1024 * 1024 },
    };
  }
}
