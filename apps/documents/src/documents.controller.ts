import { MessagePattern, Payload } from '@nestjs/microservices';
import { Documents } from './documents.entity'
import { Controller,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
@Controller()
export class DocumentController {
   constructor(
      @InjectRepository(Documents) private documentRepository: Repository<Documents>,

    ) {}

  @MessagePattern('document.upload')
  async handleDocumentUpload(
    @Payload() data: { userId: number; filename: string; path: string },
  ) {
    const payload = {
      ownerId: data.userId,
      filename: data.filename,
      path: data.path,
    }

    const doc = this.documentRepository.create(payload);

    await this.documentRepository.save(doc);
    console.log(`Document uploaded successfully: ${JSON.stringify(doc)}`);

    return { success: true, documentId: doc.id };
  }


}
