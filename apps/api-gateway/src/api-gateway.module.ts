import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common'; // Ensure correct import path
import { ApiGatwayUserController } from './user/api-gateway-user.controller';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ApiGatewayDocumentController } from './document/api-gateway-document.controller';
import { DocumentModule } from '../../documents/src/documents.module';
import {ApiGatewayIngestionController  } from './ingestion/api-gateway-ingestion.controller';
import {IngestionModule  } from '../../ingestion/src/ingestion.module';



import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    IngestionModule,
    DocumentModule,
    RmqModule.register({ name: 'USER_SERVICE' }), // ✅ Ensure correct name
    RmqModule.register({ name: 'DOCUMENT_SERVICE' }), // ✅ Ensure correct name
    RmqModule.register({ name: 'INGESTION_SERVICE' })
  ],
  controllers: [ApiGatwayUserController, ApiGatewayDocumentController,ApiGatewayController,ApiGatewayIngestionController],
  providers:[ApiGatewayService]
})
export class ApiGatewayModule {}

