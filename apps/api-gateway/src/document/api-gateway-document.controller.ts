import { Controller, Post,  UseInterceptors, Inject, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '@nestjs/passport';

@Controller('documents')
export class ApiGatewayDocumentController {
  constructor(@Inject('DOCUMENT_SERVICE') private readonly documentService: ClientProxy) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // ✅ Store files inside 'uploads' folder
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))

  async uploadDocument(@UploadedFile() file: Express.Multer.File, @Request() req) {
  if (!file) {
  throw new BadRequestException('No file uploaded');
}
    
    const uploadData = {
      userId: req.user.id,
      filename: file.originalname,
      path: file.path,
    };

    
    return this.documentService.send('document.upload', uploadData);
  }
}
