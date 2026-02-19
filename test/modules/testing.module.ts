import { DynamicModule, Module } from '@nestjs/common';
import { mockRedis } from '../mock/redis.mock';
import { mockClientProxy } from '../mock/rabbitmq.mock';
import { mockJwtService } from '../mock/jwt.mock';

@Module({})
export class CentralTestingModule {
  static register(options: {
    mockRedis?: boolean;
    mockRMQ?: boolean;
    mockJWT?: boolean;
  }): DynamicModule {

    const providers: any[] = [];

    if (options.mockRedis) {
      providers.push({
        provide: 'REDIS_CLIENT',
        useValue: mockRedis,
      });
    }

    if (options.mockRMQ) {
      providers.push({
        provide: 'DOCUMENT_SERVICE',
        useValue: mockClientProxy,
      });
    }

    if (options.mockJWT) {
      providers.push({
        provide: 'JwtService',
        useValue: mockJwtService,
      });
    }

    return {
      module: CentralTestingModule,
      providers,
      exports: providers,
    };
  }
}
