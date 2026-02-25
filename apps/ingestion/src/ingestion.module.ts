import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { Documents } from '../../documents/src/documents.entity';
import { DocumentsModule } from '../../documents/src/documents.module';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common'; // Ensure correct import path
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionWebsocket } from './ingestion.websocket';

@Module({
  imports: [
    TypeOrmModule.forFeature([Documents]),
    ConfigModule.forRoot({ isGlobal: true }),
    RmqModule.register({ name: 'ingestion' }),
    DocumentsModule,
  ],
  controllers: [IngestionController,],
  providers: [
    IngestionService,
    IngestionWebsocket,
    {
      provide: 'ingestion', // Ensure this matches your injection token
      useExisting: IngestionService,
    },
  ],
})
export class IngestionModule { }
