import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { ClientProxy } from '@nestjs/microservices';

describe('IngestionController', () => {
  let controller: IngestionController;
  let ingestionService: IngestionService;

  const mockIngestionService = {
    startIngestion: jest.fn(),
    getStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: 'INGESTION_SERVICE',
          useValue: mockIngestionService,
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    ingestionService = module.get<IngestionService>('INGESTION_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('startIngestions', () => {
    it('should start ingestion successfully', async () => {
      const payload = { documentId: 'doc123', userId: 1 };
      const expectedResponse = { message: 'Ingestion started', documentId: 'doc123', status: 'Processing' };

      mockIngestionService.startIngestion.mockResolvedValue(expectedResponse);

      const result = await controller.startIngestions(payload);

      expect(mockIngestionService.startIngestion).toHaveBeenCalledWith(payload.documentId, payload.userId);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getIngestionStatus', () => {
    it('should return ingestion status', async () => {
      const documentId = 'doc123';
      const expectedStatus = { documentId, status: 'Processing' };

      mockIngestionService.getStatus.mockResolvedValue(expectedStatus);

      const result = await controller.getIngestionStatus(documentId);

      expect(mockIngestionService.getStatus).toHaveBeenCalledWith(documentId);
      expect(result).toEqual(expectedStatus);
    });
  });
});
