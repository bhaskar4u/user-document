import { NestFactory } from '@nestjs/core';
import { IngestionModule } from './ingestion.module';
import { RmqService } from '@app/common';


async function bootstrap() {
  const appContext = await NestFactory.createMicroservice(IngestionModule);
    const rmqService = appContext.get(RmqService);

  const app = await NestFactory.createMicroservice(IngestionModule, rmqService.getOptions('INGESTION_SERVICE'));
  

  await app.listen();
     
}
bootstrap();
