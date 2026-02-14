import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './documents.controller';
import { DocumentsService } from './documents.service';

describe('DocumentController', () => {
  let controller: DocumentController;

  const mockDocumentsService = {
    uploadDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle document upload', async () => {
    const payload = {
      userId: 1,
      filename: 'test.pdf',
      path: '/uploads/test.pdf',
    };

    mockDocumentsService.uploadDocument.mockResolvedValue({
      success: true,
      documentId: 100,
    });

    const result = await controller.uploadDocument(payload);

    expect(mockDocumentsService.uploadDocument)
      .toHaveBeenCalledWith(payload);

    expect(result).toEqual({
      success: true,
      documentId: 100,
    });
  });
});