import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { Repository } from 'typeorm';
import { Documents } from '../../documents/src/documents.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { IngestionWebsocket } from './ingestion.websocket';
import { BusinessError } from '@app/common';

enum DocumentStatus {
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
}

describe('IngestionService', () => {
  let service: IngestionService;
  let documentRepo: Repository<Documents>;
  let websocket: IngestionWebsocket;

  const mockDocumentRepo = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockWebsocket = {
    sendUpdate: jest.fn(), // Mock sendUpdate function
    server: {
      emit: jest.fn(), // Mock emit to prevent undefined error
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: IngestionWebsocket,
          useValue: mockWebsocket, // Provide mocked WebSocket
        },
        {
          provide: getRepositoryToken(Documents),
          useValue: mockDocumentRepo,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    documentRepo = module.get<Repository<Documents>>(getRepositoryToken(Documents));
    websocket = module.get<IngestionWebsocket>(IngestionWebsocket);

    jest.clearAllMocks(); // Reset mocks before each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startIngestion', () => {
    it('should throw BadRequestException if documentId is invalid', async () => {
      await expect(service.startIngestion(1, 1)).rejects.toThrow(BusinessError);
    });

    it('should throw NotFoundException if document is not found', async () => {
      mockDocumentRepo.findOne.mockResolvedValue(null);

      await expect(service.startIngestion(1, 1)).rejects.toThrow(BusinessError);
    });

    it('should start ingestion and return processing status', async () => {
      const mockDocument = { id: 1, status: DocumentStatus.PROCESSING };
      mockDocumentRepo.findOne.mockResolvedValue(mockDocument);
      mockDocumentRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.startIngestion(1, 1);

      expect(mockDocumentRepo.findOne).toHaveBeenCalledWith({ where: { id: 1, ownerId: 1 }, select: ['id', 'status'] });
      expect(mockDocumentRepo.update).toHaveBeenCalledWith(1, { status: DocumentStatus.PROCESSING });

      // Ensure WebSocket emit is called correctly
      expect(websocket.sendUpdate).toHaveBeenCalledWith( // Correctly mocks sendUpdate function
        1,
        'Processing'
      );

      expect(result).toEqual({ message: 'Ingestion started', documentId: 1, status: DocumentStatus.PROCESSING });
    });
  });

  describe('getStatus', () => {
    it('should throw NotFoundException if document does not exist', async () => {
      mockDocumentRepo.findOne.mockResolvedValue(null);

      await expect(service.getStatus(1)).rejects.toThrow(BusinessError);
    });

    it('should return document status if document exists', async () => {
      const mockDocument = { id: 1, status: DocumentStatus.PROCESSING };
      mockDocumentRepo.findOne.mockResolvedValue(mockDocument);

      const result = await service.getStatus(1);

      expect(mockDocumentRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, select: ['id', 'status'] });
      expect(result).toEqual({ documentId: 1, status: DocumentStatus.PROCESSING });
    });
  });
});
