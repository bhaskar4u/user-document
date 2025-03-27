import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(UserModule);
  const rmqService = appContext.get(RmqService);

  const app = await NestFactory.createMicroservice(UserModule, rmqService.getOptions('USER_SERVICE'));

  await app.listen();
}

bootstrap();
