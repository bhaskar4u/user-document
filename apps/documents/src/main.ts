import '@libs/runtime/crypto.bootstrap'; // 👈 FIRST LINE (must be first)
import { NestFactory } from '@nestjs/core';
import { DocumentsModule } from './documents.module';
import { GlobalRpcExceptionFilter, RmqService } from '@app/common';

async function bootstrap() {
  const appContext = await NestFactory.createMicroservice(DocumentsModule);
    const rmqService = appContext.get(RmqService);

  const app = await NestFactory.createMicroservice(DocumentsModule, rmqService.getOptions('DOCUMENT_SERVICE'));
    app.useGlobalFilters(
    new GlobalRpcExceptionFilter(),
  );

  await app.listen();
}
bootstrap();



