import { Injectable,NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documents } from '../../documents/src/documents.entity';
import {IngestionWebsocket} from './ingestion.websocket'


enum DocumentStatus {
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
}

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Documents) private readonly documentRepo: Repository<Documents>,
    private readonly ingestionWebsocket: IngestionWebsocket,
  ) {}

  async startIngestion(documentId: string, userId: number) {
    const docId = Number(documentId);
    if (isNaN(docId)) {
      throw new BadRequestException('Invalid documentId');
    }
  
    const document = await this.documentRepo.findOne({
      where: { id: docId },
      select: ['id', 'status'],
    });
  
    if (!document) {
      throw new NotFoundException('Document not found');
    }
  
    await this.documentRepo.update(docId, { status: DocumentStatus.PROCESSING });
     this.ingestionWebsocket.sendUpdate(documentId, 'Processing');
  
    setTimeout(async () => {
      await this.documentRepo.update(docId, { status: DocumentStatus.COMPLETED });
      this.ingestionWebsocket.sendUpdate(documentId, 'Completed');
    }, 5000);
  
    return { message: 'Ingestion started', documentId: docId, status: DocumentStatus.PROCESSING };
  }

  async getStatus(documentId: string) {
    const document = await this.documentRepo.findOne({
      where: { id: Number(documentId) },
      select: ['id', 'status'],
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return { documentId: document.id, status: document.status };
  }
}