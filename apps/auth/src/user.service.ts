import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { delCache, getCache, setCache } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { BaseService, BusinessError, SystemError, ErrorCode } from '@app/common';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super(UserService.name);
  }

  // -------------------------
  // CREATE USER
  // -------------------------
  async createUser(dto: { username: string; email: string; password: string }) {
    try {
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
        select: ['id'],
      });

      if (existing) {
        throw new BusinessError(
          'User already exists',
          ErrorCode.USER_ALREADY_EXISTS,
        );
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = this.userRepository.create({
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      });

      await this.userRepository.save(user);
      return { message: 'User created successfully' };

    } catch (err) {
      if (err instanceof BusinessError) throw err;
      this.handleSystemError(err, 'Failed to create user');
    }
    }

  // -------------------------
  // LOGIN USER
  // -------------------------
  async loginUser(loginDto: { email: string; password: string }) {
    const DUMMY_HASH =
      '$2b$10$CwTycUXWue0Thq9StjUM0uJ8LrU8JkQGJ1sXb5EM2F5XJr8zY7Kx6'; // valid bcrypt hash

    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
        select: ['id', 'username', 'password'],
      });

      const passwordHash = user?.password ?? DUMMY_HASH;

      const isValid = await bcrypt.compare(
        loginDto.password,
        passwordHash,
      );

      if (!user || !isValid) {
        throw new BusinessError(
          'Invalid credentials',
          ErrorCode.AUTH_INVALID_CREDENTIALS,
        );
      }
      const expiresInSeconds = 3600;
      const jti = randomUUID();

      const token = this.jwtService.sign({
        sub: user.id,
        username: user.username,
        jti: jti,
      }, {
        secret: this.configService.get<string>('JWT_SECRET', 'default-secret-key'),
        expiresIn: expiresInSeconds,
      });

      await setCache(`auth:token:${user.id}`, token, expiresInSeconds);
      return {
        access_token: token,
        expires_in: expiresInSeconds,
      };
    } catch (err) {
      if (err instanceof BusinessError) throw err;
      this.handleSystemError(err, 'Login failed');
    }
    }
  
  
  // -------------------------
  // LOGOUT USER
  // -------------------------
  async logout(userId: number) {
    await delCache(`auth:token:${userId}`);
    return { message: 'Logged out successfully' };
  }
  
  
  // -------------------------
  // GET USER PROFILE (CACHED)
  // -------------------------
  async getUserProfile(userId: number) {
    try {
      const cacheKey = `auth:user:profile:${userId}`;

      const cached = await getCache<{
        id: number;
        username: string;
        email: string;
      }>(cacheKey);

      if (cached) return cached;

      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ['id', 'username', 'email'],
      });

      if (!user) {
        throw new BusinessError(
          'User not found',
          ErrorCode.USER_NOT_FOUND,
        );
      }

      await setCache(cacheKey, user, 300);

      return user;
    } catch (err) {
      if (err instanceof BusinessError) throw err;
      this.handleSystemError(err, 'Failed to fetch user profile');
    }
  
    }
  
}
