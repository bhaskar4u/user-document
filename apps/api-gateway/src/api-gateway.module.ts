import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common'; // Ensure correct import path
import { ApiGatwayAuthController } from './auth/api-gateway-auth.controller';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ApiGatewayDocumentController } from './document/api-gateway-document.controller';
import {ApiGatewayIngestionController  } from './ingestion/api-gateway-ingestion.controller';
import { HealthcheckController } from './health/healthcheck-controller';
import { AuthModule } from './authLogic/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    RmqModule.register({ name: 'auth' }), // ✅ Ensure correct name
    RmqModule.register({ name: 'document' }), // ✅ Ensure correct name
    RmqModule.register({ name: 'ingestion' })
  ],
  controllers: [ApiGatwayAuthController, ApiGatewayDocumentController,ApiGatewayController,ApiGatewayIngestionController,HealthcheckController],
  providers:[ApiGatewayService]
})
export class ApiGatewayModule {}

