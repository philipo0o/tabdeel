import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/upload')
export class UploadController {
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      // Allow images and common document types
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg|pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)) {
        return cb(new HttpException('Unsupported file type', HttpStatus.BAD_REQUEST), false);
      }
      cb(null, true);
    },
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File not uploaded', HttpStatus.BAD_REQUEST);
    }
    // Return relative URL that will be served by ServeStaticModule
    return {
      url: `/uploads/${file.filename}`
    };
  }
}
