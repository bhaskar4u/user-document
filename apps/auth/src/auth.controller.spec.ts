import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User,UserRole } from './user.entity';
import { Session } from './session.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as  RateLimiter  from '@libs/common/src/rateLimiter/worker-rate-limiter.service';


const mockQueryBuilder = {
  addSelect: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  orWhere: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  getOne: jest.fn(),
};


const mockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),

  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
});
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));
describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let sessionRepository: jest.Mocked<Repository<Session>>;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Reset QueryBuilder mocks
  mockQueryBuilder.addSelect.mockReset();
  mockQueryBuilder.where.mockReset();
  mockQueryBuilder.andWhere.mockReset();
  mockQueryBuilder.orWhere.mockReset();
  mockQueryBuilder.leftJoinAndSelect.mockReset();
  mockQueryBuilder.getOne.mockReset();

  // Restore QueryBuilder chaining
  mockQueryBuilder.addSelect.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.where.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.andWhere.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.orWhere.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.leftJoinAndSelect.mockReturnValue(mockQueryBuilder);
    jest.spyOn(RateLimiter, 'enforceRateLimit').mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
        {
          provide: getRepositoryToken(Session),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(() => 'mockJwtToken') },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn(() => 'test-secret') },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    sessionRepository = module.get(getRepositoryToken(Session));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
it('should return a valid JWT token when credentials are correct', async () => {
  const mockUser = {
    id: 1,
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    username: 'JohnDoe',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: UserRole.VIEWER,
    createdAt: new Date(),
    setDefaults: jest.fn(),
  };

  mockQueryBuilder.getOne.mockResolvedValue(mockUser as User);
  (bcrypt.compare as jest.Mock).mockResolvedValue(true);

  const result = await authService.login({
    email: 'john@example.com',
    password: 'password123',
  });
//  expect(mockQueryBuilder.getOne).toHaveBeenCalledWith();
//  expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('u.password');
//  expect(mockQueryBuilder.where).toHaveBeenCalledWith(
//     'u.email = :email',
//     { email: 'john@example.com' },
//   );
  expect(bcrypt.compare).toHaveBeenCalledWith(
    'password123',
    'hashedPassword',
  );

  expect(result).toEqual({
    access_token: 'mockJwtToken',
    refresh_token: expect.any(String),
  });
});

    it('should throw an error if credentials are invalid', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      await expect(authService.login({ email: 'john@example.com', password: 'password123' })).rejects.toThrow('Invalid credentials');
    });
  });
});
