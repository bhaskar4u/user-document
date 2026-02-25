import '@libs/runtime/crypto.bootstrap';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { GlobalRpcExceptionFilter, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserModule, {
    ...new RmqService(new (require('@nestjs/config').ConfigService)()).getOptions('user'),
  });

  app.useGlobalFilters(new GlobalRpcExceptionFilter());

  await app.listen();
}

bootstrap();