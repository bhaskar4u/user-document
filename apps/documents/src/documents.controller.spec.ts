import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './documents.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Documents } from './documents.entity';
import { Repository } from 'typeorm';

describe('DocumentController', () => {
  let controller: DocumentController;
  let documentRepository: Repository<Documents>;

  const mockDocumentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: getRepositoryToken(Documents),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    documentRepository = module.get<Repository<Documents>>(getRepositoryToken(Documents));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle document upload', async () => {
    console.log = jest.fn(); // Mock console.log

    const payload = {
      userId: 1,
      filename: 'test.pdf',
      path: '/uploads/test.pdf',
    };

    const mockDocument = {
      id: 100,
      ownerId: payload.userId,
      filename: payload.filename,
      path: payload.path,
    };

    mockDocumentRepository.create.mockReturnValue(mockDocument);
    mockDocumentRepository.save.mockResolvedValue(mockDocument);

    const result = await controller.handleDocumentUpload(payload);

    expect(mockDocumentRepository.create).toHaveBeenCalledWith({
      ownerId: payload.userId,
      filename: payload.filename,
      path: payload.path,
    });

    expect(mockDocumentRepository.save).toHaveBeenCalledWith(mockDocument);
    expect(result).toEqual({ success: true, documentId: mockDocument.id });

    expect(console.log).toHaveBeenCalledWith(`Uploading document for user ${JSON.stringify(payload.userId)}`);
    expect(console.log).toHaveBeenCalledWith(`Document uploaded successfully: ${JSON.stringify(mockDocument)}`);
  });
});
