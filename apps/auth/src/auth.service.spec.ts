jest.mock('@libs/common/src/rateLimiter/worker-rate-limiter.service', () => ({
  enforceRateLimit: jest.fn().mockResolvedValue(undefined),
}));
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Session } from './session.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { BusinessError, ErrorCode } from '@app/common';
import * as cache from '@app/common';
import * as crypto from 'crypto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<Repository<User>>;
  let sessionRepo: jest.Mocked<Repository<Session>>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            createQueryBuilder: jest.fn(),
            findOne: jest.fn(),
            insert: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Session),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    sessionRepo = module.get(getRepositoryToken(Session));
    jwtService = module.get(JwtService);

    jest.spyOn(cache, 'setCache').mockResolvedValue(undefined);
    jest.spyOn(cache, 'getCache').mockResolvedValue(null);
    jest.spyOn(cache, 'delCache').mockResolvedValue(undefined);

    jest.spyOn(crypto, 'randomUUID').mockReturnValue('123e4567-e89b-12d3-a456-426614174000',);
    jest.spyOn(crypto, 'randomBytes').mockImplementation(() => Buffer.from('refresh'));
    jest.spyOn(crypto, 'createHash').mockReturnValue({
      update: () => ({
        digest: () => 'hashed-token',
      }),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------
  // REGISTER
  // -------------------------
 describe('register', () => {
  it('should create user successfully', async () => {
    userRepo.insert.mockResolvedValue({
      identifiers: [{ uuid: '123' }],
    } as any);

    const res = await service.register({
      username: 'test',
      email: 'test@test.com',
      password: '123456',
    });

    expect(userRepo.insert).toHaveBeenCalled();
    expect(res).toEqual({ message: 'User created' });
  });

  it('should throw if user exists', async () => {
    userRepo.insert.mockRejectedValue({
      code: '23505',
    });

    await expect(
      service.register({
        username: 'test',
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toThrow('User already exists');

    expect(userRepo.insert).toHaveBeenCalled();
  });
});

  // -------------------------
  // LOGIN
  // -------------------------
  describe('login', () => {
    it('should login successfully', async () => {
      const user = {
        uuid: 'user-1',
        password: await bcrypt.hash('123456', 10),
      };

      userRepo.createQueryBuilder.mockReturnValue({
        addSelect: () => ({
          where: () => ({
            getOne: jest.fn().mockResolvedValue(user),
          }),
        }),
      } as any);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('access-token');

      const res = await service.login({
        email: 'test@test.com',
        password: '123456',
      });

      expect(res.access_token).toBeDefined();
      expect(res.refresh_token).toBeDefined();
    });

    it('should throw invalid credentials', async () => {
      userRepo.createQueryBuilder.mockReturnValue({
        addSelect: () => ({
          where: () => ({
            getOne: jest.fn().mockResolvedValue(null),
          }),
        }),
      } as any);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.login({
          email: 'test@test.com',
          password: 'wrong',
        }),
      ).rejects.toThrow(BusinessError);
    });
  });

  // -------------------------
  // REFRESH
  // -------------------------
  describe('refresh', () => {
    it('should refresh token successfully', async () => {
      const session = {
        userUuid: 'user-1',
        refreshTokenHash: 'hashed-token',
        isRevoked: false,
        expiresAt: new Date(Date.now() + 100000),
      };

      sessionRepo.findOne.mockResolvedValue(session as any);
      sessionRepo.save.mockResolvedValue(session as any);
      jwtService.sign.mockReturnValue('new-access');

      const res = await service.refresh('refresh');

      expect(res.access_token).toBe('new-access');
      expect(res.refresh_token).toBeDefined();
    });

    it('should throw for invalid refresh', async () => {
      sessionRepo.findOne.mockResolvedValue(null);

      await expect(service.refresh('bad')).rejects.toThrow(
        BusinessError,
      );
    });
  });

  // -------------------------
  // LOGOUT
  // -------------------------
  describe('logout', () => {
    it('should logout with token revoke', async () => {
      sessionRepo.update.mockResolvedValue({} as any);

      const res = await service.logout('user-1', 'refresh');

      expect(cache.delCache).toHaveBeenCalled();
      expect(sessionRepo.update).toHaveBeenCalled();
      expect(res.message).toBe('Logged out successfully');
    });

    it('should logout without refresh token', async () => {
      const res = await service.logout('user-1');

      expect(cache.delCache).toHaveBeenCalled();
      expect(sessionRepo.update).not.toHaveBeenCalled();
      expect(res.message).toBe('Logged out successfully');
    });
  });

  // -------------------------
  // PROFILE
  // -------------------------
  describe('getUserProfile', () => {
    it('should return cached user', async () => {
      jest.spyOn(cache, 'getCache').mockResolvedValue({
        id: 1,
        username: 'test',
        email: 'test@test.com',
      });

      const res = await service.getUserProfile('user-1');

      expect(res.username).toBe('test');
    });

    it('should fetch from DB if not cached', async () => {
      userRepo.findOne.mockResolvedValue({
        id: 1,
        username: 'test',
        email: 'test@test.com',
      } as any);

      const res = await service.getUserProfile('user-1');

      expect(res.username).toBe('test');
      expect(cache.setCache).toHaveBeenCalled();
    });

    it('should throw if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getUserProfile('user-1'),
      ).rejects.toThrow(BusinessError);
    });
  });
});