import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documents } from './documents.entity';
import { MessagePattern } from '@nestjs/microservices';
import { BaseService, BusinessError, ErrorCode } from '@app/common';
interface UploadPayload {
  userId: number;
  filename: string;
  path: string;
}

@Injectable()
export class DocumentsService extends BaseService implements OnModuleInit {
  constructor(
    @InjectRepository(Documents) private readonly documentRepo: Repository<Documents>,
    
  ) {
    super(DocumentsService.name);
  }
 async onModuleInit() {
  console.log('DocumentsService initialized!');
  }


  @MessagePattern('document.upload')
  async uploadDocument(payload: UploadPayload) {
    console.log(`Uploading document for user ${payload.userId}`); // ✅ Added log
 try {
      const document = this.documentRepo.create({
        ownerId: payload.userId,
        filename: payload.filename,
        path: payload.path,
      });

      await this.documentRepo.save(document);

      return { success: true, documentId: document.id };

    } catch (error) {
      this.handleSystemError(error, 'Document upload failed');
    }
  }
  
  
}
