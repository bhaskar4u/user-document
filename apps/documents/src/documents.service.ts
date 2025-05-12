import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documents } from './documents.entity';
import { MessagePattern } from '@nestjs/microservices';

interface UploadPayload {
  userId: number;
  filename: string;
  path: string;
}

@Injectable()
export class DocumentsService implements OnModuleInit {
  constructor(
    @InjectRepository(Documents) private readonly documentRepo: Repository<Documents>,
  ) {}
 async onModuleInit() {
  console.log('DocumentsService initialized!');
  }

  @MessagePattern('user.created')
  handleUserCreated(data: { userId: number }) {
    console.log(`User created with ID: ${data.userId}`);
  }
  @MessagePattern('document.upload')
  async uploadDocument(payload: UploadPayload) {
    console.log(`Uploading document for user ${payload.userId}`); // ✅ Added log
  
    const newDocument = this.documentRepo.create({
      ownerId: payload.userId,
      filename: payload.filename,
      path: payload.path,
    });
  
    await this.documentRepo.save(newDocument);
  
    console.log(`Document uploaded successfully: ${JSON.stringify(newDocument)}`);
  
    return { success: true, documentId: newDocument.id };
  }
  
}
