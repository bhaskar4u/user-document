import '@libs/runtime/crypto.bootstrap'; // 👈 FIRST LINE (must be first)
import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { GlobalRpcExceptionFilter, RmqService } from '@app/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(UserModule);
  const rmqService = appContext.get(RmqService);

  const app = await NestFactory.createMicroservice(UserModule, rmqService.getOptions('USER_SERVICE'));
  app.useGlobalFilters(
    new GlobalRpcExceptionFilter(),
  );
  await app.listen();
}

bootstrap();
