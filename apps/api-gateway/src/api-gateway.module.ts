import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common'; // Ensure correct import path
import { ApiGatwayUserController } from './user/api-gateway-user.controller';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ApiGatewayDocumentController } from './document/api-gateway-document.controller';
import { DocumentsModule } from '../../documents/src/documents.module';
import {ApiGatewayIngestionController  } from './ingestion/api-gateway-ingestion.controller';
import { HealthcheckController } from './health/healthcheck-controller';
import {IngestionModule  } from '../../ingestion/src/ingestion.module';



import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    RmqModule.register({ name: 'user' }), // ✅ Ensure correct name
    RmqModule.register({ name: 'document' }), // ✅ Ensure correct name
    RmqModule.register({ name: 'ingestion' })
  ],
  controllers: [ApiGatwayUserController, ApiGatewayDocumentController,ApiGatewayController,ApiGatewayIngestionController,HealthcheckController],
  providers:[ApiGatewayService]
})
export class ApiGatewayModule {}

