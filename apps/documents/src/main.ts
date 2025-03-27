import { NestFactory } from '@nestjs/core';
import { DocumentModule } from './documents.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const appContext = await NestFactory.createMicroservice(DocumentModule);
    const rmqService = appContext.get(RmqService);

  const app = await NestFactory.createMicroservice(DocumentModule, rmqService.getOptions('DOCUMENT_SERVICE'));
  

  await app.listen();
}
bootstrap();



