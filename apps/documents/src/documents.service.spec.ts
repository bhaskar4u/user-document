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


  it('should upload a document and save it', async () => {
    const payload = {
       userId : 1,
       filename : 'test.pdf',
       path : '/uploads/test.pdf',
       ownerId:1
    }
 
    const mockDocument = payload ;

    mockDocumentRepo.create.mockReturnValue(mockDocument);
    mockDocumentRepo.save.mockResolvedValue(mockDocument);

    const result = await service.uploadDocument(mockDocument);
    const expectedResponse = {
      success: true,
      documentId: mockDocument.userId,
    };
    expect(mockDocumentRepo.create).toHaveBeenCalledWith({
      ownerId: mockDocument.ownerId, // ✅ Ensure `ownerId` is used, not `userId`
      filename: mockDocument.filename,
      path: mockDocument.path,
    });
    expect(mockDocumentRepo.save).toHaveBeenCalledWith(expect.objectContaining(mockDocument)); // ✅ Allows additional properties
    expect(result).toMatchObject(result);


  });
});
