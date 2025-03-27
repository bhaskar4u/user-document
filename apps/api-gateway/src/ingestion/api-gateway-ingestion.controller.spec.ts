import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayIngestionController } from './api-gateway-ingestion.controller';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('ApiGatewayIngestionController', () => {
  let controller: ApiGatewayIngestionController;
  let ingestionService: ClientProxy;

  const mockIngestionService = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiGatewayIngestionController],
      providers: [
        {
          provide: 'INGESTION_SERVICE',
          useValue: mockIngestionService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock JWT Guard
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true),
      })
      .compile();

    controller = module.get<ApiGatewayIngestionController>(ApiGatewayIngestionController);
    ingestionService = module.get<ClientProxy>('INGESTION_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('startIngestion', () => {
    it('should send ingestion start request to the service', async () => {
      const mockRequest = { user: { id: 1 } }; // Mock authenticated user
      const mockBody = { documentId: '123' };

      mockIngestionService.send.mockResolvedValue({ message: 'Ingestion started', documentId: 123 });

      const result = await controller.startIngestion(mockBody, mockRequest);

      expect(ingestionService.send).toHaveBeenCalledWith('ingestion.start', { userId: 1, documentId: '123' });
      expect(result).toEqual({ message: 'Ingestion started', documentId: 123 });
    });
  });

  describe('getIngestionStatus', () => {
    it('should send ingestion status request to the service', async () => {
      const documentId = '123';

      mockIngestionService.send.mockResolvedValue({ documentId: 123, status: 'Processing' });

      const result = await controller.getIngestionStatus(documentId);

      expect(ingestionService.send).toHaveBeenCalledWith('ingestion.status', { documentId });
      expect(result).toEqual({ documentId: 123, status: 'Processing' });
    });
  });
});
