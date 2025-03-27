import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User,UserRole } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
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

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('loginUser', () => {
    it('should return a valid JWT token when credentials are correct', async () => {
      const mockUser = {
        id: 1,
        username: 'JohnDoe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: UserRole.VIEWER, // ✅ Add role
        createdAt: new Date(), // ✅ Add createdAt
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await userService.loginUser({ email: 'john@example.com', password: 'password123' });

      expect(result).toEqual({ access_token: 'mockJwtToken' });
    });

    it('should throw an error if credentials are invalid', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(userService.loginUser({ email: 'john@example.com', password: 'password123' })).rejects.toThrow('Invalid credentials');
    });
  });
});
