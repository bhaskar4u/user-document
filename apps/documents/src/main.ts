import '@libs/runtime/crypto.bootstrap'; // 👈 FIRST LINE (must be first)
import { NestFactory } from '@nestjs/core';
import { DocumentsModule } from './documents.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const appContext = await NestFactory.createMicroservice(DocumentsModule);
    const rmqService = appContext.get(RmqService);

  const app = await NestFactory.createMicroservice(DocumentsModule, rmqService.getOptions('DOCUMENT_SERVICE'));
  

  await app.listen();
}
bootstrap();



