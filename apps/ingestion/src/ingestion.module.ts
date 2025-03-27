import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { Documents } from '../../documents/src/documents.entity';
import { DocumentController } from '../../documents/src/documents.controller';
import { DocumentModule } from '../../documents/src/documents.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { RmqModule ,RmqService} from '@app/common'; // Ensure correct import path
import { TypeOrmModule } from '@nestjs/typeorm';










@Module({
  imports: [ 
 TypeOrmModule.forFeature([Documents]),
    ConfigModule.forRoot({ isGlobal: true }),
    RmqModule.register({name:'INGESTION_SERVICE'}),
    DocumentModule,
  ],
  controllers: [IngestionController,],
  providers: [
    IngestionService,
    {
    provide: 'INGESTION_SERVICE', // Ensure this matches your injection token
    useExisting: IngestionService,
  },
],
})
export class IngestionModule {}
