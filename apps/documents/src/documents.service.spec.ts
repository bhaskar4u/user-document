import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Documents } from './documents.entity';
import { Repository } from 'typeorm';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let documentRepo: Repository<Documents>;

  const mockDocumentRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Documents),
          useValue: mockDocumentRepo,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    documentRepo = module.get<Repository<Documents>>(getRepositoryToken(Documents));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log message on module init', () => {
    console.log = jest.fn(); // Mock console.log
    service.onModuleInit();
    expect(console.log).toHaveBeenCalledWith('DocumentsService initialized!');
  });

  it('should log user creation event', () => {
    console.log = jest.fn(); // Mock console.log
    service.handleUserCreated({ userId: 1 });
    expect(console.log).toHaveBeenCalledWith('User created with ID: 1');
  });

  it('should upload a document and save it', async () => {
    const userId = 1;
    const filename = 'test.pdf';
    const path = '/uploads/test.pdf';
    const mockDocument = { ownerId: userId, filename, path };

    mockDocumentRepo.create.mockReturnValue(mockDocument);
    mockDocumentRepo.save.mockResolvedValue(mockDocument);

    const result = await service.uploadDocument(userId, filename, path);

    expect(mockDocumentRepo.create).toHaveBeenCalledWith({ ownerId: userId, filename, path });
    expect(mockDocumentRepo.save).toHaveBeenCalledWith(mockDocument);
    expect(result).toEqual(mockDocument);
  });
});
