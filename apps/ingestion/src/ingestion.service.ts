import { Injectable,NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documents } from '../../documents/src/documents.entity';
import {IngestionWebsocket} from './ingestion.websocket'
import { BaseService, BusinessError, ErrorCode } from '@app/common';

enum DocumentStatus {
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
}

@Injectable()
export class IngestionService extends BaseService {
  constructor(
    @InjectRepository(Documents) private readonly documentRepo: Repository<Documents>,
    private readonly ingestionWebsocket: IngestionWebsocket,
  ) {
    super(IngestionService.name);
  }

  async startIngestion(documentId: string, userId: number) {
    const docId = Number(documentId);
    if (isNaN(docId)) {
      throw new BusinessError(
        'Invalid documentId',
        ErrorCode.DOCUMENT_NOT_FOUND,
      );
    }
  
   try {
      const document = await this.documentRepo.findOne({
        where: { id: docId },
        select: ['id', 'status'],
      });

      if (!document) {
        throw new BusinessError(
          'Document not found',
          ErrorCode.DOCUMENT_NOT_FOUND,
        );
      }

      await this.documentRepo.update(docId, {
        status: DocumentStatus.PROCESSING,
      });

      this.ingestionWebsocket.sendUpdate(documentId, 'Processing');

      setTimeout(async () => {
        await this.documentRepo.update(docId, {
          status: DocumentStatus.COMPLETED,
        });
        this.ingestionWebsocket.sendUpdate(documentId, 'Completed');
      }, 5000);

      return {
        message: 'Ingestion started',
        documentId: docId,
        status: DocumentStatus.PROCESSING,
      };

    } catch (error) {
      if (error instanceof BusinessError) throw error;
      this.handleSystemError(error, 'Ingestion failed');
    }
  }

  async getStatus(documentId: number) {
   try {
      const document = await this.documentRepo.findOne({
        where: { id: documentId },
        select: ['id', 'status'],
      });

      if (!document) {
        throw new BusinessError(
          'Document not found',
          ErrorCode.DOCUMENT_NOT_FOUND,
        );
      }

      return { documentId: document.id, status: document.status };

    } catch (error) {
      if (error instanceof BusinessError) throw error;
      this.handleSystemError(error, 'Failed to fetch ingestion status');
    }
  }
  
}