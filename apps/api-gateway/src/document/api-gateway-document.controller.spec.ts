import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayDocumentController } from './api-gateway-document.controller';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

describe('ApiGatewayDocumentController', () => {
  let controller: ApiGatewayDocumentController;
  let documentService: ClientProxy;

  const mockDocumentService = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiGatewayDocumentController],
      providers: [
        {
          provide: 'DOCUMENT_SERVICE',
          useValue: mockDocumentService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt')) // Mock AuthGuard to always return true
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true),
      })
      .compile();

    controller = module.get<ApiGatewayDocumentController>(ApiGatewayDocumentController);
    documentService = module.get<ClientProxy>('DOCUMENT_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadDocument', () => {
    it('should send document upload data to the documentService', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        path: './uploads/test.pdf',
      } as Express.Multer.File;

      const mockReq = {
        user: { id: 1 }, // Mock authenticated user
      };

      mockDocumentService.send.mockResolvedValue({ success: true, documentId: 123 });

      const result = await controller.uploadDocument(mockFile, mockReq);

      expect(documentService.send).toHaveBeenCalledWith('document.upload', {
        userId: 1,
        filename: 'test.pdf',
        path: './uploads/test.pdf',
      });

      expect(result).toEqual({ success: true, documentId: 123 });
    });
  });
});
