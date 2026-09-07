import '@libs/runtime/crypto.bootstrap';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { GlobalRpcExceptionFilter, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthModule, {
    ...new RmqService(new (require('@nestjs/config').ConfigService)()).getOptions('auth'),
  });

  app.useGlobalFilters(new GlobalRpcExceptionFilter());

  await app.listen();
}

bootstrap();