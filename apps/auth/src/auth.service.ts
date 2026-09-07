import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { Session } from './session.entity';
import { delCache, getCache, setCache } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { BaseService, BusinessError, SystemError, ErrorCode } from '@app/common';
import { randomUUID, createHash, randomBytes } from 'crypto';
import { enforceRateLimit } from '@libs/common/src/rateLimiter/worker-rate-limiter.service';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,

    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super(AuthService.name);
  }

  // -------------------------
  // CREATE USER
  // -------------------------
  async register(dto: { username: string; email: string; password: string }) {
    try {
       const hashedPassword = await bcrypt.hash(dto.password, 10);

  await this.userRepository.insert({
    username: dto.username,
    email: dto.email.toLowerCase(),
    uuid: randomUUID(),
    password: hashedPassword,
  });

  return { message: 'User created' };
    } catch (error) {
       const err = error as any;
       console.log('🔥 SERVICE ERROR', err.code);

    if (err.code === '23505') {
      throw new BusinessError(
        'User already exists',
        ErrorCode.USER_ALREADY_EXISTS,
      );
    }

    throw error instanceof BusinessError
      ? error
      : new SystemError('Failed to create user', ErrorCode.DATABASE_ERROR, error);
  }
    

  }

  // -------------------------
  // LOGIN USER
  // -------------------------
  async login(dto: { email: string; password: string }) {
    await enforceRateLimit(`login:email:${dto.email}`);
    const DUMMY_HASH =
      '$2b$10$CwTycUXWue0Thq9StjUM0uJ8LrU8JkQGJ1sXb5EM2F5XJr8zY7Kx6';

    const user = await this.userRepository
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email: dto.email.toLowerCase() })
      .getOne();

    const hash = user?.password ?? DUMMY_HASH;

    const valid = await bcrypt.compare(dto.password, hash);

    if (!user || !valid) {
      throw new BusinessError('Invalid credentials', ErrorCode.AUTH_INVALID_CREDENTIALS);
    }

    const accessJti = randomUUID();
    const refreshToken = randomBytes(64).toString('hex');
    const refreshHash = createHash('sha256').update(refreshToken).digest('hex');

    const accessToken = this.jwtService.sign(
      { sub: user.uuid, jti: accessJti, type: 'access' },
      { expiresIn: '15m', secret: this.configService.get<string>('JWT_SECRET', 'default-secret-key') },
    );

    await this.sessionRepository.save({
      userUuid: user.uuid,
      refreshTokenHash: refreshHash,
      jti: accessJti,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await setCache(`auth:jti:${accessJti}`, user.uuid, 900);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // -------------------------
  // REFRESH
  // -------------------------
  async refresh(refreshToken: string) {
    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const session = await this.sessionRepository.findOne({
      where: { refreshTokenHash: hash, isRevoked: false },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new BusinessError('Invalid refresh token', ErrorCode.AUTH_UNAUTHORIZED);
    }

    const newJti = randomUUID();
    const newRefresh = randomBytes(64).toString('hex');
    const newHash = createHash('sha256').update(newRefresh).digest('hex');

    session.refreshTokenHash = newHash;
    session.jti = newJti;

    await this.sessionRepository.save(session);

    const accessToken = this.jwtService.sign(
      { sub: session.userUuid, jti: newJti, type: 'access' },
      { expiresIn: '15m', secret: this.configService.get<string>('JWT_SECRET', 'default-secret-key') },
    );

    await setCache(`auth:jti:${newJti}`, session.userUuid, 900);

    return {
      access_token: accessToken,
      refresh_token: newRefresh,
    };
  }

  // -------------------------
  // LOGOUT USER
  // -------------------------
  async logout(userUuid: string, refreshToken?: string) {
    const promises: Promise<any>[] = [];

    // 1. Redis cache cleanup (fast invalidation)
    promises.push(delCache(`auth:token:${userUuid}`));

    // 2. Token-level revoke (secure)
    if (refreshToken) {
      const hash = createHash('sha256')
        .update(refreshToken)
        .digest('hex');

      promises.push(
        this.sessionRepository.update(
          { userUuid, refreshTokenHash: hash },
          { isRevoked: true },
        ),
      );
    }

    await Promise.all(promises);

    return { message: 'Logged out successfully' };
  }



  // -------------------------
  // GET USER PROFILE (CACHED)
  // -------------------------
  async getUserProfile(userUuid: string) {
    try {
      const cacheKey = `auth:user:profile:${userUuid}`;

      const cached = await getCache<{
        id: number;
        username: string;
        email: string;
      }>(cacheKey);

      if (cached) return cached;

      const user = await this.userRepository.findOne({
        where: { uuid: userUuid },
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


