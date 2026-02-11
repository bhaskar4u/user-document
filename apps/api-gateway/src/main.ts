import '@libs/runtime/crypto.bootstrap'; // 👈 FIRST LINE (must be first)
import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  AllExceptionFilter,
  RpcToHttpExceptionFilter,
} from '@app/common';
async function bootstrap() {
  // Create an HTTP-based API Gateway app
  const app = await NestFactory.create(ApiGatewayModule);
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  
  // Enable CORS (optional)
  app.enableCors();
    // ⚠️ ORDER MATTERS
  app.useGlobalFilters(
    new RpcToHttpExceptionFilter(), // 1️⃣ RMQ → HTTP
    new AllExceptionFilter(),       // 2️⃣ Pure HTTP
  );
  const config = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('This is the API documentation for all endpoints')
  .setVersion('1.0')
  .addBearerAuth() // JWT auth if required
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  // Start both HTTP and Microservice
  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('🚀 API Gateway running on http://localhost:3000');
}

bootstrap();
