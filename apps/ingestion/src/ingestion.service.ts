import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documents } from '../../documents/src/documents.entity';
import { IngestionWebsocket } from './ingestion.websocket'
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

  async startIngestion(documentId: number, userId: number) {
    if (!Number.isInteger(documentId) || documentId <= 0) {
      throw new BusinessError(
        'Invalid documentId',
        ErrorCode.DOCUMENT_NOT_FOUND,
      );
    }

    try {
      const document = await this.documentRepo.findOne({
        where: { id: documentId, ownerId: userId },
        select: ['id', 'status'],
      });

      if (!document) {
        throw new BusinessError(
          'Document not found',
          ErrorCode.DOCUMENT_NOT_FOUND,
        );
      }

      await this.updateStatus(documentId, DocumentStatus.PROCESSING);

      // simulate async ingestion (non-blocking)
      this.simulateProcessing(documentId);

      return {
        message: 'Ingestion started',
        documentId,
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



  private async updateStatus(
    documentId: number,
    status: DocumentStatus,
  ) {
    await this.documentRepo.update(documentId, { status });
    this.ingestionWebsocket.sendUpdate(documentId, status);
  }

  private simulateProcessing(documentId: number) {
    setTimeout(() => {
      this.updateStatus(documentId, DocumentStatus.COMPLETED)
        .catch(err => this.handleSystemError(err, 'Completion failed'));
    }, 5000);
  }

}

