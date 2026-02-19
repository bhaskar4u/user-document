import { AuthModule } from "@apps/api-gateway/src/auth/auth.module";
import { createTestApp } from "@test/factories/test-app.factory";
import { mockClientProxy } from "@test/mock/rabbitmq.mock";
import { mockRedis } from "@test/mock/redis.mock";

describe('Auth Integration', () => {
  let app;

  beforeAll(async () => {
    app = await createTestApp(AuthModule, [
      {
        provide: 'REDIS_CLIENT',
        useValue: mockRedis,
      },
      {
        provide: 'DOCUMENT_SERVICE',
        useValue: mockClientProxy,
      },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should login user', async () => {
    // supertest here
  });
});
